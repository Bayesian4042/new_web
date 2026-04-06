import React, { useState, useEffect, useRef, useCallback, useMemo, useReducer } from "react";
import {
  FileText,
  Link as LinkIcon,
  Plus,
  Trash2,
  ExternalLink,
  FileUp,
  Pill,
  Globe,
  X,
  Mic,
  Square,
  Play,
  Pause,
  RotateCcw,
  Check,
  Pencil,
  Users,
  Search,
  UserPlus,
  ChevronRight,
  Eye,
  Smartphone,
  Printer,
  Copy,
  LayoutTemplate,
  Sparkles,
  Loader2,
  Send,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { TiptapEditor } from "../../components/ui/TiptapEditor";
import { SideSheet, SideSheetItem } from "../../components/ui/SideSheet";
import { ClinicSelector } from "../../components/ui/ClinicSelector";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import type { OTCList } from "./OTCLists";
import type { OTCProduct } from "./OTCListForm";
import { AVAILABLE_OTC_PRODUCTS } from "./OTCListForm";
import { DEFAULT_TEXT_BLOCKS, TEXT_BLOCK_CATEGORIES } from "../../lib/textBlocks";

interface Product {
  id: string;
  name: string;
  type: string;
  instruction: string;
  timeOfDay: string[];
  price: string;
  color?: string;
}

interface SortableProductProps {
  product: Product;
  onRemove: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Product>) => void;
  onToggleTime: (id: string, timeChar: string) => void;
}

type CardVisualCategory =
  | "abstract"
  | "people"
  | "exercise"
  | "diet"
  | "otc"
  | "colors"
  | "voice";

type CardStyleMeta = {
  id: string;
  color?: string;
  img?: string;
};

// Artifact: unified model for documents, links, and voice notes — each rendered as a visual card
interface Artifact {
  id: string;
  type: "document" | "link" | "voice";
  // document-specific
  fileName?: string;
  fileSize?: string;
  // link-specific
  url?: string;
  // card visual properties
  title: string;
  visualCategory: CardVisualCategory;
  backgroundKey: string;
  backgroundColor?: string;
}

// Draft used in the card editor side sheet
type ArtifactDraft = Partial<Artifact>;

interface Patient {
  id: string;
  name: string;
  dob?: string;
  email?: string;
  phone?: string;
}

// Seed of mock patients — in production this would come from an API
const MOCK_PATIENTS: Patient[] = [
  { id: "p1", name: "Anna Müller", dob: "1985-03-12", email: "anna@example.com", phone: "+49 170 111 2233" },
  { id: "p2", name: "Thomas Becker", dob: "1972-07-04", email: "t.becker@example.com", phone: "+49 160 444 5566" },
  { id: "p3", name: "Sofia Rossi", dob: "1990-11-28", email: "sofia.r@example.com" },
  { id: "p4", name: "James O'Brien", dob: "1968-01-15", phone: "+353 87 999 0011" },
  { id: "p5", name: "Leila Ahmadi", dob: "2001-06-22", email: "leila.a@example.com", phone: "+49 151 222 3344" },
  { id: "p6", name: "Marcus Weiss", dob: "1955-09-09", email: "m.weiss@example.com" },
];

// ── Prebuilt text blocks ─────────────────────────────────────────────────────
// TextBlock type and DEFAULT_TEXT_BLOCKS are imported from ../../lib/textBlocks

interface PlanFormProps {
  initialData?: {
    id: string;
    name: string;
    content?: string;
    documents?: { name: string; size: string }[];
    links?: string[];
    products?: Product[];
    cards?: {
      id: string;
      type: string;
      title: string;
      description?: string;
      visualCategory: CardVisualCategory;
      backgroundKey: string;
      backgroundColor?: string;
    }[];
    assignedClinics?: string[];
    assignedCategories?: string[];
  } | null;
  userRole: "admin" | "clinic";
  doctorName: string;
  onChange: (data: Record<string, unknown>) => void;
  onSubmit: () => void;
  onCancel: () => void;
  otcLists: OTCList[];
  onCreateOTCPackage?: () => void;
  plans?: any[];
  companionTemplates?: Array<{
    id: string;
    name: string;
    [key: string]: any;
  }>;
  onOpenCompanionFromPlan?: (payload: CompanionFromPlanPayload) => void;
}

export interface CompanionFromPlanPayload {
  mode: "existing" | "new";
  existingCompanionId?: string;
  planData: {
    name: string;
    content: string;
    artifacts: Artifact[];
    products: Product[];
    assignedClinics: string[];
    assignedCategories: string[];
    assignedPatients: Patient[];
  };
}

type CompanionChoice = "existing" | "new";

interface ShareFlowState {
  step: "idle" | "confirm" | "choose";
  choice: CompanionChoice | null;
  templateId: string;
}

type ShareFlowAction =
  | { type: "OPEN_CONFIRM" }
  | { type: "OPEN_CHOOSE" }
  | { type: "SET_CHOICE"; payload: CompanionChoice }
  | { type: "SET_TEMPLATE"; payload: string }
  | { type: "RESET" };

const INITIAL_SHARE_FLOW_STATE: ShareFlowState = {
  step: "idle",
  choice: null,
  templateId: "",
};

function shareFlowReducer(state: ShareFlowState, action: ShareFlowAction): ShareFlowState {
  switch (action.type) {
    case "OPEN_CONFIRM":
      return {
        ...state,
        step: "confirm",
      };
    case "OPEN_CHOOSE":
      return {
        ...state,
        step: "choose",
      };
    case "SET_CHOICE":
      return {
        ...state,
        choice: action.payload,
        templateId: action.payload === "new" ? "" : state.templateId,
      };
    case "SET_TEMPLATE":
      return {
        ...state,
        templateId: action.payload,
      };
    case "RESET":
      return INITIAL_SHARE_FLOW_STATE;
    default:
      return state;
  }
}

const SortableProductRow: React.FC<SortableProductProps> = ({
  product,
  onRemove,
  onUpdate,
  onToggleTime,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: product.id });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        opacity: isDragging ? 0.9 : 1,
        backgroundColor: product.color || undefined,
      }}
      className="bg-white border border-gray-100 rounded-lg p-3 hover:border-blue-200 transition-all group cursor-grab active:cursor-grabbing"
    >
      <div className="flex items-center gap-3">
        {/* Drag handle */}
        <button
          type="button"
          className="flex flex-col justify-center items-center text-gray-300 hover:text-blue-500 shrink-0"
          {...attributes}
          {...listeners}
        >
          <span className="h-1 w-3 rounded-full bg-current mb-0.5" />
          <span className="h-1 w-3 rounded-full bg-current" />
        </button>

        {/* Product Info */}
        <div className="min-w-0 w-48">
          <p className="text-xs font-bold text-gray-900 truncate">
            {product.name}
          </p>
          <span className="text-[10px] text-gray-500">{product.type}</span>
        </div>

        {/* Dosage Input */}
        <input
          type="text"
          value={product.instruction}
          onChange={(e) =>
            onUpdate(product.id, {
              instruction: e.target.value,
            })
          }
          placeholder="Dosage..."
          className="flex-1 bg-gray-50 border border-gray-200 rounded px-2 py-1.5 text-xs focus:bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
        />

        {/* Time of Day */}
        <div className="flex items-center gap-1">
          {TIMES.map((t) => (
            <button
              key={t.char}
              onClick={() => onToggleTime(product.id, t.char)}
              title={t.label}
              className={`w-7 h-7 rounded text-[10px] font-black transition-all border ${
                product.timeOfDay.includes(t.char)
                  ? "bg-blue-600 border-blue-600 text-white"
                  : "bg-gray-50 border-gray-200 text-gray-400 hover:bg-gray-100"
              }`}
            >
              {t.char}
            </button>
          ))}
        </div>

        {/* Delete Button */}
        <button
          onClick={() => onRemove(product.id)}
          className="p-1 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded transition-all shrink-0"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
};

const TIMES = [
  { label: "Morning", char: "M" },
  { label: "Noon", char: "N" },
  { label: "Late", char: "L" },
  { label: "Evening", char: "E" },
];

type RecorderState = "idle" | "recording" | "recorded";

interface VoiceNoteRecorderProps {
  onRecorded?: () => void;
  onCleared?: () => void;
}

function VoiceNoteRecorder({ onRecorded, onCleared }: VoiceNoteRecorderProps) {
  const [recorderState, setRecorderState] = useState<RecorderState>("idle");
  const [elapsed, setElapsed] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [bars, setBars] = useState<number[]>(Array(28).fill(3));

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const formatTime = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const animateBars = useCallback(() => {
    if (!analyserRef.current) return;
    const data = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(data);
    const step = Math.floor(data.length / 28);
    setBars(
      Array.from({ length: 28 }, (_, i) => {
        const val = data[i * step] ?? 0;
        return Math.max(3, Math.round((val / 255) * 40));
      }),
    );
    animFrameRef.current = requestAnimationFrame(animateBars);
  }, []);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const audioCtx = new AudioContext();
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 128;
      source.connect(analyser);
      analyserRef.current = analyser;

      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = (e) => chunksRef.current.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setAudioUrl(URL.createObjectURL(blob));
      };
      recorder.start();
      mediaRecorderRef.current = recorder;

      setElapsed(0);
      setRecorderState("recording");
      timerRef.current = setInterval(() => setElapsed((s) => s + 1), 1000);
      animFrameRef.current = requestAnimationFrame(animateBars);
    } catch {
      // microphone permission denied — silently ignore
    }
  }, [animateBars]);

  const stopRecording = useCallback(() => {
    mediaRecorderRef.current?.stop();
    streamRef.current?.getTracks().forEach((t) => t.stop());
    if (timerRef.current) clearInterval(timerRef.current);
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    setBars(Array(28).fill(3));
    setRecorderState("recorded");
    onRecorded?.();
  }, [onRecorded]);

  const reset = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setAudioUrl(null);
    setIsPlaying(false);
    setElapsed(0);
    setBars(Array(28).fill(3));
    setRecorderState("idle");
    onCleared?.();
  }, [onCleared]);

  const togglePlay = useCallback(() => {
    if (!audioUrl) return;
    if (!audioRef.current) {
      audioRef.current = new Audio(audioUrl);
      audioRef.current.onended = () => setIsPlaying(false);
    }
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  }, [audioUrl, isPlaying]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      streamRef.current?.getTracks().forEach((t) => t.stop());
      audioRef.current?.pause();
    };
  }, []);

  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 flex items-center gap-3">
      {/* Waveform */}
      <div className="flex items-end gap-[2px] h-6 flex-1">
        {bars.map((h, i) => (
          <div
            key={i}
            className={`flex-1 rounded-full transition-all duration-75 ${
              recorderState === "recording"
                ? "bg-red-500"
                : recorderState === "recorded"
                  ? "bg-gray-400"
                  : "bg-gray-300"
            }`}
            style={{ height: `${Math.min(h, 24)}px` }}
          />
        ))}
      </div>

      {/* Timer */}
      <span
        className={`text-[11px] font-mono font-semibold tabular-nums shrink-0 ${
          recorderState === "recording" ? "text-red-500" : "text-gray-400"
        }`}
      >
        {formatTime(elapsed)}
      </span>

      {/* Controls */}
      {recorderState === "idle" && (
        <button
          type="button"
          onClick={startRecording}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-500 hover:bg-red-600 text-white text-[11px] font-semibold shadow-sm transition-all shrink-0"
        >
          <Mic size={12} />
          Record
        </button>
      )}

      {recorderState === "recording" && (
        <button
          type="button"
          onClick={stopRecording}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-900 hover:bg-black text-white text-[11px] font-semibold shadow-sm transition-all shrink-0"
        >
          <Square size={11} />
          Stop
        </button>
      )}

      {recorderState === "recorded" && (
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={togglePlay}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-full border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-[11px] font-semibold transition-all"
          >
            {isPlaying ? <Pause size={11} /> : <Play size={11} />}
            {isPlaying ? "Pause" : "Play"}
          </button>
          <button
            type="button"
            onClick={reset}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-full border border-gray-200 bg-white hover:bg-gray-50 text-gray-500 text-[11px] font-semibold transition-all"
          >
            <RotateCcw size={11} />
            Redo
          </button>
          <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-semibold">
            <Check size={11} />
            Saved
          </div>
        </div>
      )}
    </div>
  );
}

// Icon for each artifact type used in card badge
function ArtifactTypeIcon({ type }: { type: Artifact["type"] }) {
  if (type === "document") return <FileText size={11} />;
  if (type === "link") return <Globe size={11} />;
  return <Mic size={11} />;
}

export function PlanForm2({
  initialData,
  userRole,
  doctorName,
  onChange,
  onSubmit,
  onCancel,
  otcLists,
  onCreateOTCPackage,
  plans = [],
  companionTemplates = [],
  onOpenCompanionFromPlan,
}: PlanFormProps) {
  const [mode, setMode] = useState<"create" | "import">("create");
  const [name, setName] = useState(initialData?.name || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [products, setProducts] = useState<Product[]>(
    initialData?.products || [],
  );
  const [importUrl, setImportUrl] = useState("");
  const [selectedClinics, setSelectedClinics] = useState<string[]>(
    initialData?.assignedClinics || [],
  );
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialData?.assignedCategories || [],
  );
  const [deliveryMethod, setDeliveryMethod] = useState<"sms" | "sms_email" | "pdf">(
    (initialData as any)?.deliveryMethod || "sms",
  );

  // Patient assignment state
  const [assignedPatients, setAssignedPatients] = useState<Patient[]>([]);
  const [isPatientSheetOpen, setIsPatientSheetOpen] = useState(false);
  const [shareFlow, dispatchShareFlow] = useReducer(
    shareFlowReducer,
    INITIAL_SHARE_FLOW_STATE,
  );

  // Preview panel
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Text blocks sheet
  const [isBlockSheetOpen, setIsBlockSheetOpen] = useState(false);

  // AI generate panel
  const [showAiPanel, setShowAiPanel] = useState(false);
  const [aiPatientContext, setAiPatientContext] = useState("");

  // Card library sheet
  const [isLibrarySheetOpen, setIsLibrarySheetOpen] = useState(false);
  const [aiSections, setAiSections] = useState<string[]>(["Overview", "Instructions"]);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiError, setAiError] = useState("");

  // Inline link input state
  const [newLink, setNewLink] = useState("");
  const [showLinkInput, setShowLinkInput] = useState(false);

  // Voice recorder visibility
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false);

  // Build dynamic package items from OTC Lists
  const packageItems: SideSheetItem[] = (otcLists || []).map((list) => ({
    id: list.id,
    name: list.name,
    price:
      list.products
        ?.reduce((sum, p) => {
          const numeric = parseFloat(
            p.price?.replace(/[^\d.,]/g, "").replace(",", ".") || "0",
          );
          return sum + (isNaN(numeric) ? 0 : numeric);
        }, 0)
        .toFixed(2) + " €",
    category: "OTC List",
    icon: <Pill size={16} />,
    products: (list.products || []) as OTCProduct[],
  }));

  // SideSheet state
  const [isProductSheetOpen, setIsProductSheetOpen] = useState(false);
  const [tempProductIds, setTempProductIds] = useState<string[]>([]);


  // Drag & drop sensors for package items
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
  );

  // ── Card style presets ──────────────────────────────────────────────────────

  const COLOR_CARD_HEX: string[] = [
    "#e2cd65",
    "#b47fe2",
    "#1d5d9a",
    "#e2886d",
    "#78b7e2",
    "#6915a3",
    "#e23b34",
    "#86c568",
    "#1cc18d",
    "#ff63c8",
    "#e29446",
    "#1d5932",
  ];

  const buildCardImages = (baseName: string): string[] =>
    Array.from({ length: 12 }).map(
      (_, i) =>
        new URL(
          `../../CARDS/${baseName}_${String(i + 1).padStart(2, "0")}.png`,
          import.meta.url,
        ).href,
    );

  const ABSTRACT_IMAGES = buildCardImages("Card_Abstract");
  const PEOPLE_IMAGES = buildCardImages("Card_People");
  const EXERCISE_IMAGES = buildCardImages("Card_Exercise");
  const DIET_IMAGES = buildCardImages("Card_Diet");
  const OTC_IMAGES = buildCardImages("Card_OTC");
  const VOICE_IMAGES = buildCardImages("Card_Sound");

  const CARD_STYLE_IDS: Record<CardVisualCategory, CardStyleMeta[]> = {
    abstract: ABSTRACT_IMAGES.map((src, idx) => ({
      id: `abstract-${idx + 1}`,
      img: src,
    })),
    people: PEOPLE_IMAGES.map((src, idx) => ({
      id: `people-${idx + 1}`,
      img: src,
    })),
    exercise: EXERCISE_IMAGES.map((src, idx) => ({
      id: `exercise-${idx + 1}`,
      img: src,
    })),
    diet: DIET_IMAGES.map((src, idx) => ({ id: `diet-${idx + 1}`, img: src })),
    otc: OTC_IMAGES.map((src, idx) => ({ id: `otc-${idx + 1}`, img: src })),
    voice: VOICE_IMAGES.map((src, idx) => ({
      id: `voice-${idx + 1}`,
      img: src,
    })),
    colors: COLOR_CARD_HEX.map((hex, idx) => ({
      id: `color-${idx + 1}`,
      color: hex,
    })),
  };

  // ── Artifacts state ─────────────────────────────────────────────────────────

  const [artifacts, setArtifacts] = useState<Artifact[]>(() => {
    const initial: Artifact[] = [];

    // Hydrate from initialData.documents
    (initialData?.documents || []).forEach((doc) => {
      const style = assignRandomCardStyleFrom(CARD_STYLE_IDS);
      initial.push({
        id: `doc-${Date.now()}-${Math.random()}`,
        type: "document",
        fileName: doc.name,
        fileSize: doc.size,
        title: doc.name,
        ...style,
      });
    });

    // Hydrate from initialData.links
    (initialData?.links || []).forEach((url) => {
      const style = assignRandomCardStyleFrom(CARD_STYLE_IDS);
      initial.push({
        id: `link-${Date.now()}-${Math.random()}`,
        type: "link",
        url,
        title: url,
        ...style,
      });
    });

    // Hydrate from initialData.cards (voice and others)
    (initialData?.cards || []).forEach((card) => {
      const artifactType =
        card.type === "voice" ? "voice" : "document";
      initial.push({
        id: card.id,
        type: artifactType,
        title: card.title,
        visualCategory: card.visualCategory,
        backgroundKey: card.backgroundKey,
        backgroundColor: card.backgroundColor,
      });
    });

    return initial;
  });

  // ── Card editor side sheet state ────────────────────────────────────────────

  const [isCardEditorOpen, setIsCardEditorOpen] = useState(false);
  const [editingArtifactId, setEditingArtifactId] = useState<string | null>(null);
  const [artifactDraft, setArtifactDraft] = useState<ArtifactDraft>({});

  const CARD_TYPE_OPTIONS: { id: CardVisualCategory; label: string }[] = [
    { id: "abstract", label: "Abstract" },
    { id: "people", label: "People" },
    { id: "exercise", label: "Exercise" },
    { id: "diet", label: "Diet" },
    { id: "otc", label: "OTC" },
    { id: "colors", label: "Colors" },
    { id: "voice", label: "Voice" },
  ];

  // ── Helper: random card style assignment ────────────────────────────────────

  function assignRandomCardStyleFrom(
    styleIds: Record<CardVisualCategory, CardStyleMeta[]>,
  ): Pick<Artifact, "visualCategory" | "backgroundKey" | "backgroundColor"> {
    const categories: CardVisualCategory[] = [
      "abstract",
      "people",
      "exercise",
      "diet",
      "otc",
      "colors",
    ];
    const cat = categories[Math.floor(Math.random() * categories.length)];
    const styles = styleIds[cat];
    const style = styles[Math.floor(Math.random() * styles.length)];
    return {
      visualCategory: cat,
      backgroundKey: style.id,
      backgroundColor: cat === "colors" ? style.color : undefined,
    };
  }

  function assignVoiceCardStyle(): Pick<
    Artifact,
    "visualCategory" | "backgroundKey" | "backgroundColor"
  > {
    const styles = CARD_STYLE_IDS.voice;
    const style = styles[Math.floor(Math.random() * styles.length)];
    return {
      visualCategory: "voice",
      backgroundKey: style.id,
      backgroundColor: undefined,
    };
  }

  // ── getCardStyle: derive CSS from an artifact's visual props ────────────────

  const getArtifactCardStyle = (artifact: Artifact): React.CSSProperties => {
    const category = artifact.visualCategory;
    const selectedStyle = CARD_STYLE_IDS[category]?.find(
      (s) => s.id === artifact.backgroundKey,
    );
    if (category === "colors" && artifact.backgroundColor)
      return { backgroundColor: artifact.backgroundColor };
    if (selectedStyle?.img)
      return {
        backgroundImage: `url(${selectedStyle.img})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      };
    return { backgroundImage: "linear-gradient(135deg, #111827, #4b5563)" };
  };

  // ── Artifact CRUD ────────────────────────────────────────────────────────────

  const removeArtifact = (id: string) =>
    setArtifacts((prev) => prev.filter((a) => a.id !== id));

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newArtifacts: Artifact[] = Array.from(files).map((file) => ({
      id: `doc-${Date.now()}-${Math.random()}`,
      type: "document",
      fileName: file.name,
      fileSize: (file.size / (1024 * 1024)).toFixed(1) + " MB",
      title: file.name.replace(/\.[^.]+$/, ""),
      ...assignRandomCardStyleFrom(CARD_STYLE_IDS),
    }));
    setArtifacts((prev) => [...prev, ...newArtifacts]);
    e.target.value = "";
  };

  const handleAddLink = () => {
    if (!newLink.trim()) return;
    const url = newLink.trim();
    const newArtifact: Artifact = {
      id: `link-${Date.now()}`,
      type: "link",
      url,
      title: url,
      ...assignRandomCardStyleFrom(CARD_STYLE_IDS),
    };
    setArtifacts((prev) => [...prev, newArtifact]);
    setNewLink("");
    setShowLinkInput(false);
  };

  const handleVoiceRecorded = useCallback(() => {
    const voiceArtifact: Artifact = {
      id: `voice-${Date.now()}`,
      type: "voice",
      title: `Voice note from ${doctorName}`,
      ...assignVoiceCardStyle(),
    };
    setArtifacts((prev) => [
      ...prev.filter((a) => a.type !== "voice"),
      voiceArtifact,
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doctorName]);

  const handleVoiceCleared = useCallback(() => {
    setArtifacts((prev) => prev.filter((a) => a.type !== "voice"));
  }, []);

  // ── Card editor: open/close/save ─────────────────────────────────────────────

  const openCardEditor = (artifact: Artifact) => {
    setEditingArtifactId(artifact.id);
    setArtifactDraft({ ...artifact });
    setIsCardEditorOpen(true);
  };

  const closeCardEditor = () => {
    setIsCardEditorOpen(false);
    setEditingArtifactId(null);
    setArtifactDraft({});
  };

  const handleCardEditorSave = () => {
    if (!editingArtifactId || !artifactDraft.visualCategory || !artifactDraft.backgroundKey)
      return;
    setArtifacts((prev) =>
      prev.map((a) =>
        a.id === editingArtifactId
          ? {
              ...a,
              title: (artifactDraft.title || "").trim() || a.title,
              visualCategory: artifactDraft.visualCategory as CardVisualCategory,
              backgroundKey: artifactDraft.backgroundKey as string,
              backgroundColor: artifactDraft.backgroundColor,
            }
          : a,
      ),
    );
    closeCardEditor();
  };

  const handleDraftTypeSelect = (cat: CardVisualCategory) => {
    const firstStyle = CARD_STYLE_IDS[cat][0];
    setArtifactDraft((prev) => ({
      ...prev,
      visualCategory: cat,
      backgroundKey: firstStyle?.id,
      backgroundColor: cat === "colors" ? firstStyle?.color : undefined,
    }));
  };

  const handleDraftStyleSelect = (cat: CardVisualCategory, styleId: string) => {
    const style = CARD_STYLE_IDS[cat].find((s) => s.id === styleId);
    setArtifactDraft((prev) => ({
      ...prev,
      visualCategory: cat,
      backgroundKey: styleId,
      backgroundColor: cat === "colors" ? style?.color : undefined,
    }));
  };

  // ── onChange sync ────────────────────────────────────────────────────────────

  useEffect(() => {
    onChange({
      name,
      content,
      artifacts,
      // backward-compat derivations
      documents: artifacts
        .filter((a) => a.type === "document")
        .map((a) => ({ name: a.fileName || a.title, size: a.fileSize || "" })),
      links: artifacts.filter((a) => a.type === "link").map((a) => a.url ?? ""),
      products,
      importUrl: mode === "import" ? importUrl : undefined,
      isImport: mode === "import",
      assignedClinics: selectedClinics,
      assignedCategories: selectedCategories,
      assignedPatients,
      deliveryMethod,
    });
  }, [
    name,
    content,
    artifacts,
    products,
    importUrl,
    mode,
    selectedClinics,
    selectedCategories,
    assignedPatients,
    deliveryMethod,
    onChange,
  ]);

  const buildCompanionPayload = (
    mode: "existing" | "new",
    existingCompanionId?: string,
  ): CompanionFromPlanPayload => ({
    mode,
    existingCompanionId,
    planData: {
      name,
      content,
      artifacts,
      products,
      assignedClinics: selectedClinics,
      assignedCategories: selectedCategories,
      assignedPatients,
      deliveryMethod,
    },
  });

  const handlePlanSaveClick = () => {
    dispatchShareFlow({ type: "OPEN_CONFIRM" });
  };

  const handleSaveWithoutCompanion = () => {
    dispatchShareFlow({ type: "RESET" });
    onSubmit();
  };

  const handleSaveWithCompanion = () => {
    dispatchShareFlow({ type: "OPEN_CHOOSE" });
  };

  const handleCompanionChoiceContinue = () => {
    if (!shareFlow.choice) return;
    if (shareFlow.choice === "existing" && !shareFlow.templateId) return;

    onSubmit();
    if (onOpenCompanionFromPlan) {
      onOpenCompanionFromPlan(
        buildCompanionPayload(
          shareFlow.choice,
          shareFlow.choice === "existing" ? shareFlow.templateId : undefined,
        ),
      );
    }

    dispatchShareFlow({ type: "RESET" });
  };

  // ── Product handlers ─────────────────────────────────────────────────────────

  const openProductSheet = () => {
    setTempProductIds(products.map((p) => p.id));
    setIsProductSheetOpen(true);
  };

  const handleProductSheetConfirm = () => {
    const selectedPackages = packageItems.filter((pkg) =>
      tempProductIds.includes(pkg.id),
    );
    const allProducts: Product[] = [];

    selectedPackages.forEach((pkg) => {
      (pkg.products as OTCProduct[]).forEach((prod) => {
        const existing = products.find((ep) => ep.id === prod.id);
        if (!allProducts.find((p) => p.id === prod.id)) {
          allProducts.push(
            existing || {
              id: prod.id,
              name: prod.name,
              type: prod.category,
              price: prod.price,
              instruction: prod.instruction || "",
              timeOfDay: prod.timeOfDay || [],
              color: prod.color,
            },
          );
        }
      });
    });

    setProducts(allProducts);
    setIsProductSheetOpen(false);
  };

  const addSingleProduct = (prod: OTCProduct) => {
    if (products.find((p) => p.id === prod.id)) return;
    setProducts((prev) => [
      ...prev,
      {
        id: prod.id,
        name: prod.name,
        type: prod.category,
        price: prod.price,
        instruction: prod.instruction || '',
        timeOfDay: prod.timeOfDay || [],
        color: prod.color,
      },
    ]);
  };

  const removeProduct = (id: string) =>
    setProducts(products.filter((p) => p.id !== id));

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(products.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  };

  const toggleTime = (productId: string, timeChar: string) => {
    setProducts(
      products.map((p) => {
        if (p.id === productId) {
          const times = p.timeOfDay.includes(timeChar)
            ? p.timeOfDay.filter((t) => t !== timeChar)
            : [...p.timeOfDay, timeChar];
          return { ...p, timeOfDay: times };
        }
        return p;
      }),
    );
  };

  // ── Draft card preview style ─────────────────────────────────────────────────

  const getDraftPreviewStyle = (): React.CSSProperties => {
    if (!artifactDraft.visualCategory || !artifactDraft.backgroundKey)
      return { backgroundImage: "linear-gradient(135deg, #111827, #4b5563)" };
    const category = artifactDraft.visualCategory;
    const selectedStyle = CARD_STYLE_IDS[category]?.find(
      (s) => s.id === artifactDraft.backgroundKey,
    );
    if (category === "colors" && artifactDraft.backgroundColor)
      return { backgroundColor: artifactDraft.backgroundColor };
    if (selectedStyle?.img)
      return {
        backgroundImage: `url(${selectedStyle.img})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      };
    return { backgroundImage: "linear-gradient(135deg, #111827, #4b5563)" };
  };

  // ── AI generation ───────────────────────────────────────────────────────────

  const AI_SECTION_OPTIONS = [
    "Overview",
    "Instructions",
    "Diet recommendations",
    "Exercise routine",
    "Medication guidance",
    "Post-op care",
    "Mental health support",
    "Follow-up schedule",
    "Warning signs",
  ];

  const toggleAiSection = (s: string) =>
    setAiSections((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s],
    );

  const handleAiGenerate = async () => {
    if (!aiSections.length) {
      setAiError("Please select at least one section to generate.");
      return;
    }
    setAiError("");
    setAiGenerating(true);

    // Build a prompt string (ready to send to OpenAI / any LLM)
    const contextText = aiPatientContext.trim()
      ? `Patient context: ${aiPatientContext.trim()}. `
      : "";
    const planNameText = name.trim() ? `Plan name: "${name}". ` : "";

    // ── Swap this block for a real fetch() to your AI endpoint ──────────────
    // const response = await fetch("/api/generate", {
    //   method: "POST",
    //   body: JSON.stringify({ prompt, sections: aiSections, context: aiPatientContext }),
    // });
    // const { html } = await response.json();
    // setContent((prev) => prev ? prev + html : html);
    // ────────────────────────────────────────────────────────────────────────

    // Mock: simulate a short delay then insert templated HTML
    await new Promise((r) => setTimeout(r, 1400));

    const sectionBlocks = aiSections.map((section) => {
      const ctx = contextText || planNameText
        ? ` tailored to the ${contextText || planNameText}patient`
        : "";
      return `<h2>${section}</h2><p>This section covers ${section.toLowerCase()}${ctx}. Please review and personalise the content below before sending it to the patient.</p>`;
    });

    const generated = sectionBlocks.join("");
    setContent((prev) => (prev ? prev + generated : generated));

    setAiGenerating(false);
    setShowAiPanel(false);
    setAiPatientContext("");
    setAiSections(["Overview", "Instructions"]);
  };

  // ── Render ───────────────────────────────────────────────────────────────────

  const TIMES_LABELS: Record<string, string> = { M: "Morning", N: "Noon", L: "Late", E: "Evening" };

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500 relative">

      {/* ── Vertical preview toggle tab ── */}
      <div className="fixed right-0 top-1/2 -translate-y-1/2 z-30">
        <button
          type="button"
          onClick={() => setIsPreviewOpen((v) => !v)}
          className={`flex items-center justify-center p-2.5 rounded-l-xl border border-r-0 shadow-md transition-all duration-300 ${
            isPreviewOpen
              ? "bg-gray-900 border-gray-900 text-white"
              : "bg-white border-gray-200 text-gray-500 hover:text-gray-900 hover:border-gray-400"
          }`}
          title={isPreviewOpen ? "Close preview" : "Open preview"}
        >
          <Eye size={16} />
        </button>
      </div>

      {/* ── Split layout wrapper ── */}
      <div className={`flex gap-0 transition-all duration-300 ${isPreviewOpen ? "pr-[420px]" : ""}`}>

      {/* ── Form column ── */}
      <div className="flex-1 min-w-0 flex flex-col gap-4">

      <Card
        noPadding
        className="overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:bg-gray-400"
      >
        <div className="space-y-0 divide-y divide-gray-100">

          {/* ── Plan Name & Mode ── */}
          <div className="p-6">
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Plan Name
                </label>
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Post-Op Recovery Guide"
                />
              </div>
              <Button
                variant="outline"
                className="gap-1.5 text-indigo-600 border-indigo-200 hover:bg-indigo-50"
                onClick={() => window.open("#", "_blank")}
                title="Preview plan"
              >
                <ExternalLink size={14} />
              </Button>
            </div>
          </div>

          {/* ── Description ── */}
          <div className="p-6">
            {/* Label row */}
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-900">
                {mode === "create" ? "Description" : "Description (Optional)"}
              </label>
              <div className="flex items-center gap-2">
                {/* AI Generate button */}
                <button
                  type="button"
                  onClick={() => setShowAiPanel((v) => !v)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                    showAiPanel
                      ? "bg-violet-600 border-violet-600 text-white"
                      : "text-violet-600 bg-violet-50 hover:bg-violet-100 border-violet-200"
                  }`}
                >
                  <Sparkles size={12} />
                  Generate with AI
                  {showAiPanel ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
                </button>
                {/* Add block button */}
                <button
                  type="button"
                  onClick={() => setIsBlockSheetOpen(true)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-all"
                >
                  <LayoutTemplate size={12} />
                  Add block
                </button>
              </div>
            </div>

            {/* AI Generate panel */}
            {showAiPanel && (
              <div className="mb-3 rounded-xl border border-violet-200 bg-violet-50/60 p-4 space-y-3">
                {/* Patient context */}
                <div>
                  <label className="block text-xs font-semibold text-violet-800 mb-1.5">
                    Patient context
                    <span className="text-violet-400 font-normal ml-1">(optional)</span>
                  </label>
                  <textarea
                    value={aiPatientContext}
                    onChange={(e) => setAiPatientContext(e.target.value)}
                    rows={2}
                    placeholder="e.g. 45-year-old female, post knee replacement, mild diabetes, anxious about exercise…"
                    className="w-full px-3 py-2 text-sm border border-violet-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-violet-400 focus:border-violet-400 resize-none placeholder-gray-400"
                  />
                </div>

                {/* Section selector */}
                <div>
                  <label className="block text-xs font-semibold text-violet-800 mb-2">
                    Sections to generate
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {AI_SECTION_OPTIONS.map((s) => {
                      const active = aiSections.includes(s);
                      return (
                        <button
                          key={s}
                          type="button"
                          onClick={() => toggleAiSection(s)}
                          className={`px-2.5 py-1 text-[11px] font-semibold rounded-full border transition-all ${
                            active
                              ? "bg-violet-600 border-violet-600 text-white"
                              : "bg-white border-violet-200 text-violet-600 hover:border-violet-400"
                          }`}
                        >
                          {active && <Check size={9} className="inline mr-1" />}
                          {s}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Error */}
                {aiError && (
                  <p className="text-xs text-red-500 font-medium">{aiError}</p>
                )}

                {/* Actions */}
                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => { setShowAiPanel(false); setAiError(""); }}
                    className="px-3 py-1.5 text-xs font-semibold text-gray-500 hover:text-gray-700 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleAiGenerate}
                    disabled={aiGenerating || aiSections.length === 0}
                    className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white rounded-lg transition-all"
                  >
                    {aiGenerating ? (
                      <>
                        <Loader2 size={12} className="animate-spin" />
                        Generating…
                      </>
                    ) : (
                      <>
                        <Sparkles size={12} />
                        Generate
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            <TiptapEditor
              content={content}
              onChange={setContent}
              contentClassName="min-h-[80px]"
              placeholder={
                mode === "create"
                  ? "Describe the clinical goals..."
                  : "Add notes..."
              }
            />
          </div>

          {mode === "import" ? (
            /* ── Import URL ── */
            <div className="p-6">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Import Source URL
              </label>
              <div className="relative">
                <Input
                  type="url"
                  icon={<Globe size={16} />}
                  value={importUrl}
                  onChange={(e) => setImportUrl(e.target.value)}
                  placeholder="https://..."
                  className="pl-10"
                />
                {importUrl && (
                  <div className="absolute right-2 top-1/2 -translate-y-1/2">
                    <a
                      href={importUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 text-gray-400 hover:text-blue-600 bg-gray-50 hover:bg-blue-50 rounded-md transition-all block"
                    >
                      <ExternalLink size={14} />
                    </a>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
              {/* ── Package Items ── */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <Pill size={14} className="text-blue-500" />
                    Package Items
                  </h2>
                  <Button
                    onClick={openProductSheet}
                    size="sm"
                    className="gap-1.5 bg-blue-600 text-white hover:bg-blue-700 h-8 text-xs"
                  >
                    <Plus size={14} />
                    Add
                  </Button>
                </div>

                {products.length === 0 ? (
                  <div className="flex items-center justify-center py-6 border-2 border-dashed border-gray-100 rounded-lg bg-gray-50/50">
                    <p className="text-xs text-gray-400 font-medium">
                      No products selected
                    </p>
                  </div>
                ) : (
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={(event: DragEndEvent) => {
                      const { active, over } = event;
                      if (!over || active.id === over.id) return;
                      setProducts((items) => {
                        const oldIndex = items.findIndex(
                          (p) => p.id === active.id,
                        );
                        const newIndex = items.findIndex(
                          (p) => p.id === over.id,
                        );
                        if (oldIndex === -1 || newIndex === -1) return items;
                        return arrayMove(items, oldIndex, newIndex);
                      });
                    }}
                  >
                    <SortableContext
                      items={products.map((p) => p.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="space-y-2">
                        {products.map((product) => (
                          <SortableProductRow
                            key={product.id}
                            product={product}
                            onRemove={removeProduct}
                            onUpdate={updateProduct}
                            onToggleTime={toggleTime}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                )}
              </div>

              {/* ── Cards (formerly Artifacts) ── */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <FileUp size={14} className="text-indigo-500" />
                    Cards
                  </h2>
                  <Button
                    onClick={() => setIsLibrarySheetOpen(true)}
                    size="sm"
                    className="gap-1.5 bg-gray-900 text-white hover:bg-black h-8 text-xs px-3"
                  >
                    <Plus size={14} />
                    Add
                  </Button>
                </div>

                {/* Artifact card grid */}
                {artifacts.length > 0 && (
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-2 mb-4">
                    {artifacts.map((artifact) => (
                      <div
                        key={artifact.id}
                        className="relative group rounded-xl overflow-hidden min-h-[88px] flex flex-col justify-end cursor-pointer"
                        style={getArtifactCardStyle(artifact)}
                        onClick={() => openCardEditor(artifact)}
                      >
                        {/* Gradient overlay for legibility */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />

                        {/* Type badge — top left */}
                        <div className="absolute top-1.5 left-1.5 flex items-center gap-0.5 bg-black/30 backdrop-blur-sm text-white text-[9px] font-semibold px-1.5 py-0.5 rounded-full">
                          <ArtifactTypeIcon type={artifact.type} />
                          <span className="capitalize">{artifact.type}</span>
                        </div>

                        {/* Hover action buttons — top right */}
                        <div className="absolute top-1.5 right-1.5 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              openCardEditor(artifact);
                            }}
                            className="p-0.5 bg-black/40 hover:bg-black/60 backdrop-blur-sm text-white rounded transition-all"
                            title="Edit card style"
                          >
                            <Pencil size={10} />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeArtifact(artifact.id);
                            }}
                            className="p-0.5 bg-black/40 hover:bg-red-500/80 backdrop-blur-sm text-white rounded transition-all"
                            title="Remove"
                          >
                            <Trash2 size={10} />
                          </button>
                        </div>

                        {/* Title + subtitle at the bottom */}
                        <div className="relative z-10 p-2">
                          <p className="text-white text-[10px] font-bold leading-snug line-clamp-2 drop-shadow">
                            {artifact.title}
                          </p>
                          {artifact.type === "link" && artifact.url && (
                            <p className="text-white/70 text-[9px] truncate mt-0.5">
                              {artifact.url}
                            </p>
                          )}
                          {artifact.type === "document" && artifact.fileSize && (
                            <p className="text-white/70 text-[9px] mt-0.5">
                              {artifact.fileSize}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </Card>

      {/* ── Assign Patients ── */}
      <Card noPadding>
        <div className="p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <Users size={14} className="text-violet-500" />
                Assigned Patients
              </h2>
              <p className="text-[11px] text-gray-400 mt-0.5">
                Send this plan directly to one or more patients.
              </p>
            </div>
            <Button
              size="sm"
              onClick={() => setIsPatientSheetOpen(true)}
              className="gap-1.5 bg-violet-600 hover:bg-violet-700 text-white h-8 text-xs"
            >
              <UserPlus size={13} />
              Assign Patient
            </Button>
          </div>

          {assignedPatients.length === 0 ? (
            <button
              type="button"
              onClick={() => setIsPatientSheetOpen(true)}
              className="w-full flex items-center justify-center gap-2 py-5 border-2 border-dashed border-gray-100 rounded-xl bg-gray-50/50 hover:border-violet-300 hover:bg-violet-50/30 transition-all group"
            >
              <Users size={16} className="text-gray-300 group-hover:text-violet-400 transition-colors" />
              <span className="text-xs text-gray-400 font-medium group-hover:text-violet-500 transition-colors">
                No patients assigned yet
              </span>
              <ChevronRight size={13} className="text-gray-300 group-hover:text-violet-400 transition-colors" />
            </button>
          ) : (
            <div className="space-y-1.5">
              {assignedPatients.map((patient) => (
                <div
                  key={patient.id}
                  className="flex items-center justify-between px-3 py-2 rounded-lg bg-violet-50 border border-violet-100"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="h-7 w-7 rounded-full bg-violet-200 text-violet-700 flex items-center justify-center text-[10px] font-bold shrink-0">
                      {patient.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-gray-900 truncate">{patient.name}</p>
                      <p className="text-[10px] text-gray-400 truncate">
                        {patient.email || patient.phone || (patient.dob ? `DOB ${patient.dob}` : "")}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAssignedPatients((prev) => prev.filter((p) => p.id !== patient.id))}
                    className="p-1 text-gray-300 hover:text-red-400 hover:bg-red-50 rounded transition-all shrink-0"
                  >
                    <X size={13} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setIsPatientSheetOpen(true)}
                className="flex items-center gap-1.5 text-[11px] text-violet-500 hover:text-violet-700 font-semibold mt-1 transition-colors"
              >
                <Plus size={12} />
                Add another patient
              </button>
            </div>
          )}
        </div>
      </Card>

      {/* ── Clinic Selector ── */}
      <Card noPadding>
        <div className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <Send size={14} className="text-indigo-500" />
            <h2 className="text-sm font-bold text-gray-900">Choose Delivery Method</h2>
          </div>
          <p className="text-[11px] text-gray-400 mb-4">
            Select how this plan should be delivered to the patient.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {[
              {
                id: "sms" as const,
                title: "Link via SMS",
                description: "Send plan preview link to patient phone",
              },
              {
                id: "sms_email" as const,
                title: "Link via SMS + Email",
                description: "Send plan preview link via phone and email",
              },
              {
                id: "pdf" as const,
                title: "Download as PDF",
                description: "Generate printable version of the plan",
              },
            ].map((option) => {
              const active = deliveryMethod === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setDeliveryMethod(option.id)}
                  className={`text-left border rounded-lg p-3 transition-all ${
                    active
                      ? "border-indigo-300 bg-indigo-50"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <p className={`text-xs font-semibold ${active ? "text-indigo-900" : "text-gray-900"}`}>
                    {option.title}
                  </p>
                  <p className={`text-[11px] mt-1 ${active ? "text-indigo-600" : "text-gray-500"}`}>
                    {option.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </Card>

      {/* ── Clinic Selector ── */}
      <ClinicSelector
        selectedClinics={selectedClinics}
        onSelectionChange={setSelectedClinics}
        selectedCategories={selectedCategories}
        onCategoriesChange={setSelectedCategories}
        userRole={userRole}
      />

      {/* ── Action Buttons ── */}
      <div className="flex items-center justify-end gap-3 bg-white border-t border-gray-200 py-3 px-6 rounded-lg shadow-sm">
        <Button onClick={onCancel} variant="outline" className="px-6">
          Cancel
        </Button>
        <Button
          onClick={handlePlanSaveClick}
          className="bg-gray-900 hover:bg-gray-800 text-white px-6"
        >
          {initialData ? "Save Changes" : "Create Plan"}
        </Button>
      </div>

      </div>{/* end form column */}

      </div>{/* end split layout */}

      {/* ── Preview panel (fixed right, slides in) ── */}
      <div
        className={`fixed inset-y-0 right-0 z-20 w-[420px] bg-gray-50 border-l border-gray-200 flex flex-col transition-transform duration-300 ease-in-out ${
          isPreviewOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Preview header */}
        <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200 shrink-0">
          <div className="flex items-center gap-2">
            <Smartphone size={14} className="text-gray-400" />
            <span className="text-sm font-semibold text-gray-900">Patient Preview</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
              title="Print"
            >
              <Printer size={14} />
            </button>
            <button
              type="button"
              className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
              title="Copy link"
            >
              <Copy size={14} />
            </button>
          </div>
        </div>

        {/* Preview body — scrollable */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full">

          {/* Plan title */}
          <div>
            <h1 className="text-xl font-bold text-gray-900 leading-snug">
              {name || <span className="text-gray-300">Untitled plan</span>}
            </h1>
            <p className="text-xs text-gray-400 mt-1">por {doctorName}</p>
          </div>

          {/* Description */}
          {content && (
            <div
              className="prose prose-sm prose-gray max-w-none text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          )}

          {/* Artifact cards grid */}
          {artifacts.length > 0 && (
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Attachments</p>
              <div className="grid grid-cols-2 gap-2">
                {artifacts.map((artifact) => (
                  <div
                    key={artifact.id}
                    className="relative rounded-xl overflow-hidden min-h-[80px] flex flex-col justify-end"
                    style={getArtifactCardStyle(artifact)}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
                    <div className="absolute top-1.5 left-1.5 flex items-center gap-0.5 bg-black/30 backdrop-blur-sm text-white text-[9px] font-semibold px-1.5 py-0.5 rounded-full">
                      <ArtifactTypeIcon type={artifact.type} />
                      <span className="capitalize">{artifact.type}</span>
                    </div>
                    <div className="relative z-10 p-2">
                      <p className="text-white text-[10px] font-bold leading-snug line-clamp-2 drop-shadow">
                        {artifact.title}
                      </p>
                      {artifact.type === "link" && artifact.url && (
                        <p className="text-white/70 text-[9px] truncate mt-0.5">{artifact.url}</p>
                      )}
                      {artifact.type === "document" && artifact.fileSize && (
                        <p className="text-white/70 text-[9px] mt-0.5">{artifact.fileSize}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Package items table */}
          {products.length > 0 && (
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Products</p>
              <div className="rounded-xl border border-gray-200 overflow-hidden bg-white">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="text-left px-3 py-2 text-gray-500 font-semibold">Producto</th>
                      <th className="text-left px-3 py-2 text-gray-500 font-semibold">Posología</th>
                      <th className="text-left px-3 py-2 text-gray-500 font-semibold">Instrucciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {products.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-3 py-2.5">
                          <p className="font-medium text-gray-900 leading-snug">{product.name}</p>
                          {product.type && (
                            <p className="text-[10px] text-gray-400 mt-0.5">{product.type}</p>
                          )}
                        </td>
                        <td className="px-3 py-2.5">
                          <div className="flex flex-col gap-0.5">
                            {["M", "N", "L", "E"].map((char) => (
                              <div key={char} className="flex items-center gap-1.5">
                                <div
                                  className={`h-3.5 w-3.5 rounded-full border flex items-center justify-center shrink-0 ${
                                    product.timeOfDay.includes(char)
                                      ? "bg-gray-900 border-gray-900"
                                      : "border-gray-300"
                                  }`}
                                >
                                  {product.timeOfDay.includes(char) && (
                                    <div className="h-1.5 w-1.5 rounded-full bg-white" />
                                  )}
                                </div>
                                <span className={`text-[10px] ${product.timeOfDay.includes(char) ? "text-gray-700 font-semibold" : "text-gray-300"}`}>
                                  {TIMES_LABELS[char]}
                                </span>
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="px-3 py-2.5 text-gray-600 leading-snug max-w-[100px]">
                          {product.instruction || <span className="text-gray-300">—</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Assigned patients */}
          {assignedPatients.length > 0 && (
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Assigned To</p>
              <div className="flex flex-wrap gap-2">
                {assignedPatients.map((p) => (
                  <div key={p.id} className="flex items-center gap-1.5 bg-violet-50 border border-violet-100 rounded-full px-2.5 py-1">
                    <div className="h-4 w-4 rounded-full bg-violet-200 text-violet-700 flex items-center justify-center text-[8px] font-bold shrink-0">
                      {p.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                    </div>
                    <span className="text-xs text-violet-800 font-medium">{p.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty state */}
          {!content && artifacts.length === 0 && products.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Eye size={28} className="text-gray-200 mb-3" />
              <p className="text-sm text-gray-400 font-medium">Nothing to preview yet</p>
              <p className="text-xs text-gray-300 mt-1">Fill in the form to see how it looks to the patient.</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Product SideSheet ── */}
      <SideSheet
        isOpen={isProductSheetOpen}
        onClose={() => setIsProductSheetOpen(false)}
        title="Add to Plan"
        description="Select a package or search for a single product"
        items={packageItems}
        selectedIds={tempProductIds}
        onSelectionChange={setTempProductIds}
        onConfirm={handleProductSheetConfirm}
        searchPlaceholder="Search packages..."
        onCreateNew={onCreateOTCPackage ? () => { setIsProductSheetOpen(false); onCreateOTCPackage(); } : undefined}
        createNewLabel="Create new OTC package"
        singleProducts={AVAILABLE_OTC_PRODUCTS}
        addedSingleProductIds={products.map((p) => p.id)}
        onAddSingleProduct={addSingleProduct}
      />

      {/* ── Card Editor Side Sheet ── */}
      {isCardEditorOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/20 z-40 transition-opacity"
            onClick={closeCardEditor}
          />
          <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-xl flex flex-col animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="flex items-start justify-between px-5 py-4 border-b border-gray-200 bg-white">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Edit Card Style
                </h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  Customise the visual card for this attachment.
                </p>
              </div>
              <button
                onClick={closeCardEditor}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full">

              {/* Live preview */}
              <div
                className="relative rounded-2xl overflow-hidden min-h-[120px] flex flex-col justify-end"
                style={getDraftPreviewStyle()}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <div className="relative z-10 p-3">
                  <p className="text-white text-sm font-bold leading-snug drop-shadow">
                    {(artifactDraft.title || "").trim() || "Card preview"}
                  </p>
                </div>
              </div>

              {/* Card type selector */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Card type
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {CARD_TYPE_OPTIONS.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => handleDraftTypeSelect(t.id)}
                      className={`px-2 py-2 text-[11px] rounded-lg border text-center transition-all ${
                        artifactDraft.visualCategory === t.id
                          ? "border-gray-900 bg-gray-900 text-white shadow-sm"
                          : "border-gray-200 bg-white text-gray-700 hover:border-gray-400"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Card style picker strip */}
              {artifactDraft.visualCategory && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Pick a style
                  </p>
                  <div className="flex gap-2 overflow-x-auto pb-1 [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full">
                    {CARD_STYLE_IDS[artifactDraft.visualCategory].map((style) => {
                      const isSelected = artifactDraft.backgroundKey === style.id;
                      const bgStyle =
                        artifactDraft.visualCategory === "colors" && style.color
                          ? { backgroundColor: style.color }
                          : style.img
                            ? {
                                backgroundImage: `url(${style.img})`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                              }
                            : {
                                backgroundImage:
                                  "linear-gradient(135deg, #111827, #4b5563)",
                              };
                      return (
                        <button
                          key={style.id}
                          type="button"
                          onClick={() =>
                            handleDraftStyleSelect(
                              artifactDraft.visualCategory as CardVisualCategory,
                              style.id,
                            )
                          }
                          className={`relative shrink-0 w-36 h-20 rounded-xl overflow-hidden transition-all ${
                            isSelected
                              ? "ring-2 ring-gray-900 ring-offset-2 scale-105"
                              : "hover:scale-[1.03] hover:ring-1 hover:ring-gray-300 ring-offset-1"
                          }`}
                          style={bgStyle}
                        >
                          {isSelected && (
                            <div className="absolute top-1.5 right-1.5 h-4 w-4 rounded-full bg-white flex items-center justify-center shadow">
                              <Check size={9} className="text-gray-900" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Title on card */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Title on card
                </label>
                <textarea
                  value={artifactDraft.title || ""}
                  onChange={(e) =>
                    setArtifactDraft((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  rows={2}
                  className="w-full border border-gray-200 rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 resize-none"
                  placeholder="What should the patient see on this card?"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-end gap-2">
                <Button variant="outline" size="sm" onClick={closeCardEditor}>
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleCardEditorSave}
                  disabled={
                    !artifactDraft.visualCategory || !artifactDraft.backgroundKey
                  }
                  className="bg-gray-900 text-white hover:bg-black disabled:opacity-40"
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── Card Library Side Sheet ── */}
      {isLibrarySheetOpen && (
        <CardLibrarySideSheet
          plans={plans}
          onAdd={(newCards) => setArtifacts((prev) => [...prev, ...newCards])}
          onClose={() => setIsLibrarySheetOpen(false)}
        />
      )}

      {/* ── Patient Side Sheet ── */}
      {isPatientSheetOpen && (
        <PatientSideSheet
          assignedPatients={assignedPatients}
          onAssign={(patients) => setAssignedPatients(patients)}
          onClose={() => setIsPatientSheetOpen(false)}
        />
      )}

      {/* ── Text Blocks Side Sheet ── */}
      {isBlockSheetOpen && (
        <TextBlocksSideSheet
          onInsert={(html) => {
            setContent(html);
            setIsBlockSheetOpen(false);
          }}
          onClose={() => setIsBlockSheetOpen(false)}
        />
      )}

      {shareFlow.step === "confirm" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-gray-900">Send as companion?</h3>
                <p className="text-sm text-gray-500 mt-1">
                  You can continue with plan-only sharing, or attach a companion now.
                </p>
              </div>
              <button
                onClick={() => dispatchShareFlow({ type: "RESET" })}
                className="text-gray-300 hover:text-gray-500"
              >
                <X size={16} />
              </button>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSaveWithoutCompanion}
              >
                No
              </Button>
              <Button
                size="sm"
                onClick={handleSaveWithCompanion}
                className="bg-violet-600 hover:bg-violet-700 text-white"
              >
                Yes
              </Button>
            </div>
          </div>
        </div>
      )}

      {shareFlow.step === "choose" && (
        <>
          <div
            className="fixed inset-0 bg-black/20 z-40"
            onClick={() => dispatchShareFlow({ type: "RESET" })}
          />
          <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="flex items-start justify-between px-5 py-4 border-b border-gray-200">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Companion Options</h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  Select how you want to continue with companion setup.
                </p>
              </div>
              <button
                onClick={() => dispatchShareFlow({ type: "RESET" })}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              <button
                type="button"
                onClick={() => dispatchShareFlow({ type: "SET_CHOICE", payload: "existing" })}
                className={`w-full text-left border rounded-xl p-4 transition-colors ${
                  shareFlow.choice === "existing"
                    ? "border-violet-300 bg-violet-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <p className="text-sm font-semibold text-gray-900">Choose Existing Companion</p>
                <p className="text-xs text-gray-500 mt-1">
                  Copy an existing companion and inject this plan into it.
                </p>
              </button>

              <button
                type="button"
                onClick={() => dispatchShareFlow({ type: "SET_CHOICE", payload: "new" })}
                className={`w-full text-left border rounded-xl p-4 transition-colors ${
                  shareFlow.choice === "new"
                    ? "border-violet-300 bg-violet-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <p className="text-sm font-semibold text-gray-900">Build New Companion</p>
                <p className="text-xs text-gray-500 mt-1">
                  Start a new companion with defaults and this plan preloaded.
                </p>
              </button>

              {shareFlow.choice === "existing" && (
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Existing Companion
                  </label>
                  <select
                    value={shareFlow.templateId}
                    onChange={(e) =>
                      dispatchShareFlow({ type: "SET_TEMPLATE", payload: e.target.value })
                    }
                    className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-violet-400 focus:border-violet-400"
                  >
                    <option value="">Select companion</option>
                    {companionTemplates.map((template) => (
                      <option key={template.id} value={template.id}>
                        {template.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="px-5 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => dispatchShareFlow({ type: "RESET" })}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleCompanionChoiceContinue}
                  disabled={
                    !shareFlow.choice ||
                    (shareFlow.choice === "existing" && !shareFlow.templateId)
                  }
                  className="bg-violet-600 hover:bg-violet-700 text-white disabled:opacity-40"
                >
                  Save & Open Companion
                </Button>
              </div>
            </div>
          </div>
        </>
      )}

    </div>
  );
}

// ── Card Library Side Sheet component ────────────────────────────────────────

interface CardLibrarySideSheetProps {
  plans: any[];
  onAdd: (artifacts: Artifact[]) => void;
  onClose: () => void;
}

function CardLibrarySideSheet({ plans, onAdd, onClose }: CardLibrarySideSheetProps) {
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const allCards = useMemo(() => {
    const result: Artifact[] = [];
    const seen = new Set();
    plans.forEach((plan: any) => {
      (plan.artifacts || []).forEach((art: any) => {
        // Simple de-dupe by title/type for library feel
        const key = `${art.type}-${art.title}`;
        if (!seen.has(key)) {
          result.push(art as Artifact);
          seen.add(key);
        }
      });
    });
    return result;
  }, [plans]);

  const filtered = allCards.filter((c: Artifact) => {
    const q = search.toLowerCase();
    return (
      c.title.toLowerCase().includes(q) || (c.fileName || "").toLowerCase().includes(q)
    );
  });

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const handleConfirm = () => {
    const selected = allCards
      .filter((c: Artifact) => selectedIds.includes(c.id))
      .map((c: Artifact) => ({
        ...c,
        id: `${c.id}-copy-${Date.now()}`, // Create a copy with fresh ID
      }));
    onAdd(selected);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/20 z-40" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-xl bg-white shadow-xl flex flex-col animate-in slide-in-from-right duration-300">
        <div className="flex items-start justify-between px-5 py-4 border-b border-gray-200">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 font-display">Add Cards</h2>
            <p className="text-sm text-gray-500 mt-0.5">Select existing tools and resources from your library.</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex border-b border-gray-100 px-5 pt-3 gap-4">
          <button className="pb-2.5 text-xs font-bold border-b-2 border-gray-900 text-gray-900 transition-colors">
            Select Existing
          </button>
          <button className="pb-2.5 text-xs font-semibold border-b-2 border-transparent text-gray-400 hover:text-gray-600 cursor-not-allowed">
            Create New
          </button>
        </div>

        <div className="px-5 py-4">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title or file name…"
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 pb-6">
          {filtered.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-sm text-gray-400 font-medium">No results found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {filtered.map((card: Artifact) => {
                const isSelected = selectedIds.includes(card.id);
                // We use the styles from the parent since they are defined there
                // BUT we don't have access to getArtifactCardStyle here.
                // I'll rewrite a simple version for the library.
                const visualStyle: any = {};
                if (card.backgroundColor) {
                  visualStyle.backgroundColor = card.backgroundColor;
                } else if (card.visualCategory === "colors") {
                   visualStyle.backgroundColor = "#e2cd65"; // fallback
                } else {
                   // Linear gradient fallback for library view cards
                   visualStyle.backgroundImage = "linear-gradient(135deg, #4b5563, #111827)";
                }

                return (
                  <div
                    key={card.id}
                    onClick={() => toggleSelection(card.id)}
                    className={`relative group rounded-2xl overflow-hidden aspect-[1.6/1] cursor-pointer transition-all border-2 ${
                      isSelected ? "border-indigo-600 ring-2 ring-indigo-600/20 scale-[0.98]" : "border-transparent"
                    }`}
                    style={visualStyle}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/30 backdrop-blur-sm text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full">
                      <ArtifactTypeIcon type={card.type} />
                      <span className="capitalize">{card.type}</span>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <p className="text-white text-xs font-bold leading-snug line-clamp-2 drop-shadow-md">
                        {card.title}
                      </p>
                    </div>
                    {isSelected && (
                      <div className="absolute top-2 right-2 h-5 w-5 rounded-full bg-indigo-600 flex items-center justify-center border-2 border-white">
                        <Check size={10} className="text-white" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="px-5 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
            {selectedIds.length} SELECTED
          </span>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onClose} className="rounded-xl px-4">
              Cancel
            </Button>
            <Button
              size="sm"
              disabled={selectedIds.length === 0}
              onClick={handleConfirm}
              className="bg-gray-900 text-white hover:bg-black rounded-xl px-4 disabled:opacity-40"
            >
              Add Cards
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}


// ── Patient Side Sheet component ─────────────────────────────────────────────

interface PatientSideSheetProps {
  assignedPatients: Patient[];
  onAssign: (patients: Patient[]) => void;
  onClose: () => void;
}

function PatientSideSheet({ assignedPatients, onAssign, onClose }: PatientSideSheetProps) {
  const [tab, setTab] = useState<"search" | "new">("search");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Patient[]>(assignedPatients);

  // New patient form state
  const [newName, setNewName] = useState("");
  const [newDob, setNewDob] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newAdded, setNewAdded] = useState(false);

  const filtered = MOCK_PATIENTS.filter((p) => {
    const q = query.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      (p.email || "").toLowerCase().includes(q) ||
      (p.phone || "").includes(q)
    );
  });

  const togglePatient = (patient: Patient) => {
    setSelected((prev) =>
      prev.find((p) => p.id === patient.id)
        ? prev.filter((p) => p.id !== patient.id)
        : [...prev, patient],
    );
  };

  const handleAddNew = () => {
    if (!newName.trim()) return;
    const patient: Patient = {
      id: `new-${Date.now()}`,
      name: newName.trim(),
      dob: newDob || undefined,
      email: newEmail || undefined,
      phone: newPhone || undefined,
    };
    setSelected((prev) => [...prev, patient]);
    setNewAdded(true);
    setTimeout(() => {
      setNewAdded(false);
      setNewName("");
      setNewDob("");
      setNewEmail("");
      setNewPhone("");
      setTab("search");
    }, 1200);
  };

  const handleConfirm = () => {
    onAssign(selected);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/20 z-40" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-xl flex flex-col animate-in slide-in-from-right duration-300">

        {/* Header */}
        <div className="flex items-start justify-between px-5 py-4 border-b border-gray-200">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Assign Patients</h2>
            <p className="text-sm text-gray-500 mt-0.5">Search existing or add a new patient.</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 px-5 pt-3 gap-4">
          <button
            type="button"
            onClick={() => setTab("search")}
            className={`pb-2.5 text-xs font-semibold border-b-2 transition-colors ${
              tab === "search"
                ? "border-violet-600 text-violet-700"
                : "border-transparent text-gray-400 hover:text-gray-600"
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Search size={12} />
              Search Existing
            </span>
          </button>
          <button
            type="button"
            onClick={() => setTab("new")}
            className={`pb-2.5 text-xs font-semibold border-b-2 transition-colors ${
              tab === "new"
                ? "border-violet-600 text-violet-700"
                : "border-transparent text-gray-400 hover:text-gray-600"
            }`}
          >
            <span className="flex items-center gap-1.5">
              <UserPlus size={12} />
              Add New
            </span>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full">
          {tab === "search" ? (
            <div className="p-4 space-y-3">
              {/* Search input */}
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by name, email or phone…"
                  autoFocus
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-violet-400 focus:border-violet-400"
                />
              </div>

              {/* Patient list */}
              {filtered.length === 0 ? (
                <div className="py-10 text-center">
                  <p className="text-sm text-gray-400">No patients found.</p>
                  <button
                    type="button"
                    onClick={() => setTab("new")}
                    className="mt-2 text-xs text-violet-500 hover:text-violet-700 font-semibold"
                  >
                    Add a new patient instead
                  </button>
                </div>
              ) : (
                <div className="space-y-1.5">
                  {filtered.map((patient) => {
                    const isSelected = !!selected.find((p) => p.id === patient.id);
                    return (
                      <button
                        key={patient.id}
                        type="button"
                        onClick={() => togglePatient(patient)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border text-left transition-all ${
                          isSelected
                            ? "bg-violet-50 border-violet-200"
                            : "bg-white border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        <div
                          className={`h-8 w-8 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${
                            isSelected ? "bg-violet-200 text-violet-700" : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {patient.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-semibold truncate ${isSelected ? "text-violet-900" : "text-gray-900"}`}>
                            {patient.name}
                          </p>
                          <p className="text-[10px] text-gray-400 truncate">
                            {[patient.email, patient.phone, patient.dob ? `DOB ${patient.dob}` : ""]
                              .filter(Boolean)
                              .join(" · ")}
                          </p>
                        </div>
                        <div
                          className={`h-5 w-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                            isSelected ? "bg-violet-600 border-violet-600" : "border-gray-300"
                          }`}
                        >
                          {isSelected && <Check size={11} className="text-white" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            /* ── Add New Patient form ── */
            <div className="p-5 space-y-3">
              {newAdded ? (
                <div className="flex flex-col items-center justify-center py-12 gap-3">
                  <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                    <Check size={18} className="text-emerald-600" />
                  </div>
                  <p className="text-sm font-semibold text-emerald-700">Patient added!</p>
                  <p className="text-xs text-gray-400">Switching back to search…</p>
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Full Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      placeholder="e.g. Maria Schmidt"
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-violet-400 focus:border-violet-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Date of Birth <span className="text-gray-400 font-normal">(optional)</span>
                    </label>
                    <input
                      type="date"
                      value={newDob}
                      onChange={(e) => setNewDob(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-violet-400 focus:border-violet-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      placeholder="patient@example.com"
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-violet-400 focus:border-violet-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                      placeholder="+49 170 …"
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-violet-400 focus:border-violet-400"
                    />
                  </div>
                  <Button
                    onClick={handleAddNew}
                    disabled={!newName.trim()}
                    className="w-full bg-violet-600 hover:bg-violet-700 text-white disabled:opacity-40 mt-1"
                  >
                    <UserPlus size={14} className="mr-1.5" />
                    Add Patient
                  </Button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">
              {selected.length} patient{selected.length !== 1 ? "s" : ""} selected
            </span>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={onClose}>
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleConfirm}
                className="bg-violet-600 hover:bg-violet-700 text-white"
              >
                Confirm
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ── Text Blocks Side Sheet ────────────────────────────────────────────────────

interface TextBlocksSideSheetProps {
  onInsert: (html: string) => void;
  onClose: () => void;
}

function TextBlocksSideSheet({ onInsert, onClose }: TextBlocksSideSheetProps) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const filtered = DEFAULT_TEXT_BLOCKS.filter((b) => {
    const matchesCat = activeCategory === "All" || b.category === activeCategory;
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      b.label.toLowerCase().includes(q) ||
      b.preview.toLowerCase().includes(q) ||
      b.category.toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  return (
    <>
      <div className="fixed inset-0 bg-black/20 z-40" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-xl flex flex-col animate-in slide-in-from-right duration-300">

        {/* Header */}
        <div className="flex items-start justify-between px-5 py-4 border-b border-gray-200">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <LayoutTemplate size={16} className="text-indigo-500" />
              Text Blocks
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Select a prebuilt block to insert into the description.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Search */}
        <div className="px-4 pt-3 pb-0">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search blocks…"
              autoFocus
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400"
            />
          </div>
        </div>

        {/* Category tabs */}
        <div className="px-4 pt-3 pb-0 flex gap-1.5 flex-wrap">
          {TEXT_BLOCK_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-2.5 py-1 text-[11px] font-semibold rounded-full border transition-all ${
                activeCategory === cat
                  ? "bg-indigo-600 border-indigo-600 text-white"
                  : "bg-white border-gray-200 text-gray-500 hover:border-gray-400 hover:text-gray-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Block list */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full">
          {filtered.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-sm text-gray-400">No blocks match your search.</p>
            </div>
          ) : (
            filtered.map((block) => (
              <button
                key={block.id}
                type="button"
                onClick={() => onInsert(block.html)}
                onMouseEnter={() => setHoveredId(block.id)}
                onMouseLeave={() => setHoveredId(null)}
                className={`w-full text-left px-4 py-3 rounded-xl border transition-all ${
                  hoveredId === block.id
                    ? "bg-indigo-50 border-indigo-200"
                    : "bg-white border-gray-100 hover:border-gray-200"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full border ${
                        hoveredId === block.id
                          ? "bg-indigo-100 border-indigo-200 text-indigo-700"
                          : "bg-gray-100 border-gray-200 text-gray-500"
                      }`}>
                        {block.category}
                      </span>
                      <span className={`text-sm font-semibold ${hoveredId === block.id ? "text-indigo-900" : "text-gray-900"}`}>
                        {block.label}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                      {block.preview}
                    </p>
                  </div>
                  <div className={`shrink-0 mt-0.5 transition-opacity ${hoveredId === block.id ? "opacity-100" : "opacity-0"}`}>
                    <div className="flex items-center gap-1 px-2 py-1 bg-indigo-600 text-white text-[10px] font-bold rounded-lg">
                      <Plus size={10} />
                      Insert
                    </div>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-gray-100 bg-gray-50">
          <p className="text-[11px] text-gray-400 text-center">
            {filtered.length} block{filtered.length !== 1 ? "s" : ""} · Click any block to insert it
          </p>
        </div>
      </div>
    </>
  );
}
