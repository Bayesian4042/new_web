import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  FileText,
  Link as LinkIcon,
  Plus,
  Trash2,
  ExternalLink,
  PlusCircle,
  FileUp,
  Pill,
  Globe,
  Files,
  X,
  Mic,
  Square,
  Play,
  Pause,
  RotateCcw,
  Check,
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

// Card "types" are the visual categories the doctor can choose from
type CardType =
  | "abstract"
  | "people"
  | "exercise"
  | "diet"
  | "otc"
  | "colors"
  | "voice";
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

interface PlanCard {
  id: string;
  type: CardType;
  title: string;
  description?: string;
  visualCategory: CardVisualCategory;
  backgroundKey: string;
  backgroundColor?: string;
}

interface PlanFormProps {
  initialData?: {
    id: string;
    name: string;
    content?: string;
    documents?: { name: string; size: string }[];
    links?: string[];
    products?: Product[];
    cards?: PlanCard[];
    assignedClinics?: string[];
    assignedCategories?: string[];
  } | null;
  userRole: "admin" | "clinic";
  doctorName: string;
  onChange: (data: any) => void;
  onSubmit: () => void;
  onCancel: () => void;
  otcLists: OTCList[];
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

function VoiceNoteRecorder() {
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
  }, []);

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
  }, []);

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
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 space-y-4">
      {/* Waveform / status row */}
      <div className="flex items-center gap-3">
        <div className="flex items-end gap-[2px] h-10 flex-1">
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
              style={{ height: `${h}px` }}
            />
          ))}
        </div>
        <span
          className={`text-xs font-mono font-semibold tabular-nums w-10 text-right shrink-0 ${
            recorderState === "recording" ? "text-red-500" : "text-gray-500"
          }`}
        >
          {formatTime(elapsed)}
        </span>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-3">
        {recorderState === "idle" && (
          <button
            type="button"
            onClick={startRecording}
            className="flex items-center gap-2 px-5 py-2 rounded-full bg-red-500 hover:bg-red-600 text-white text-xs font-semibold shadow-sm transition-all"
          >
            <Mic size={14} />
            Record
          </button>
        )}

        {recorderState === "recording" && (
          <button
            type="button"
            onClick={stopRecording}
            className="flex items-center gap-2 px-5 py-2 rounded-full bg-gray-900 hover:bg-black text-white text-xs font-semibold shadow-sm transition-all"
          >
            <Square size={12} />
            Stop
          </button>
        )}

        {recorderState === "recorded" && (
          <>
            <button
              type="button"
              onClick={reset}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 text-xs font-semibold transition-all"
            >
              <RotateCcw size={13} />
              Redo
            </button>
            <button
              type="button"
              onClick={togglePlay}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-xs font-semibold transition-all"
            >
              {isPlaying ? <Pause size={13} /> : <Play size={13} />}
              {isPlaying ? "Pause" : "Play"}
            </button>
            <div className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
              <Check size={13} />
              Recorded
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export function PlanForm({
  initialData,
  userRole,
  doctorName,
  onChange,
  onSubmit,
  onCancel,
  otcLists,
}: PlanFormProps) {
  const [mode, setMode] = useState<"create" | "import">("create");
  const [name, setName] = useState(initialData?.name || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [documents, setDocuments] = useState<{ name: string; size: string }[]>(
    initialData?.documents || [],
  );
  const [links, setLinks] = useState<string[]>(initialData?.links || []);
  const [products, setProducts] = useState<Product[]>(
    initialData?.products || [],
  );
  const [cards, setCards] = useState<PlanCard[]>(initialData?.cards || []);
  const [newLink, setNewLink] = useState("");
  const [importUrl, setImportUrl] = useState("");
  const [selectedClinics, setSelectedClinics] = useState<string[]>(
    initialData?.assignedClinics || [],
  );
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialData?.assignedCategories || [],
  );

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

  // Card style presets (IDs only; actual art/gradients come from backend/assets)
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

  // Short, warm default texts for specific card types
  const DIET_TEXTS: string[] = [
    "Simple meals to support your recovery.",
    "Gentle diet to protect your body.",
    "Food choices aligned with your treatment.",
    "Everyday meals to keep energy stable.",
    "Small nutrition steps for long-term health.",
  ];

  const EXERCISE_TEXTS: string[] = [
    "Gentle movements to keep you active.",
    "Slow exercises designed for your condition.",
    "Short routine to support your recovery.",
    "Safe exercises you can repeat daily.",
    "Light movement to reduce stiffness and pain.",
  ];

  const OTC_TEXTS: string[] = [
    "Over-the-counter support for your symptoms.",
    "Simple medicines to ease your discomfort.",
    "Optional products to complement main treatment.",
    "Relief options to keep at home.",
    "Mild symptom helpers you can use.",
  ];

  // Card modal state
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  // UI step is implicit in what fields of cardDraft are filled
  const [cardDraft, setCardDraft] = useState<
    Partial<PlanCard> & { type?: CardType }
  >({
    type: "abstract",
    visualCategory: "abstract",
    backgroundKey: CARD_STYLE_IDS.abstract[0]?.id,
  });

  useEffect(() => {
    onChange({
      name,
      content,
      documents,
      links,
      products,
      cards,
      importUrl: mode === "import" ? importUrl : undefined,
      isImport: mode === "import",
      assignedClinics: selectedClinics,
      assignedCategories: selectedCategories,
    });
  }, [
    name,
    content,
    documents,
    links,
    products,
    cards,
    importUrl,
    mode,
    selectedClinics,
    selectedCategories,
    onChange,
  ]);

  const handleAddLink = () => {
    if (newLink && !links.includes(newLink)) {
      setLinks([...links, newLink]);
      setNewLink("");
    }
  };

  const removeDocument = (index: number) =>
    setDocuments(documents.filter((_, i) => i !== index));
  const removeLink = (index: number) =>
    setLinks(links.filter((_, i) => i !== index));

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newDocs = Array.from(files).map((file) => ({
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(1) + " MB",
      }));
      setDocuments([...documents, ...newDocs]);
    }
  };

  const openProductSheet = () => {
    setTempProductIds(products.map((p) => p.id));
    setIsProductSheetOpen(true);
  };

  const handleProductSheetConfirm = () => {
    // Get all products from selected OTC lists
    const selectedPackages = packageItems.filter((pkg) =>
      tempProductIds.includes(pkg.id),
    );
    const allProducts: Product[] = [];

    selectedPackages.forEach((pkg) => {
      (pkg.products as OTCProduct[]).forEach((prod) => {
        // Check if product already exists
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

  const openCardModal = (existingCard?: PlanCard) => {
    if (existingCard) {
      setCardDraft({ ...existingCard });
    } else {
      setCardDraft({
        type: "abstract",
        visualCategory: "abstract",
        backgroundKey: CARD_STYLE_IDS.abstract[0]?.id,
        title: "",
        description: "",
      });
    }
    setIsCardModalOpen(true);
  };

  const closeCardModal = () => {
    setIsCardModalOpen(false);
    setCardDraft({});
  };

  // Step 1: choose visual type (Abstract, People, Exercise, Diet, OTC, Colors, Voice)
  const handleCardTypeSelect = (type: CardType) => {
    if (type === "voice") {
      const voiceStyles = CARD_STYLE_IDS.voice;
      const random =
        voiceStyles[Math.floor(Math.random() * voiceStyles.length)];

      setCardDraft({
        type: "voice",
        visualCategory: "voice",
        backgroundKey: random?.id,
        backgroundColor: undefined,
        title: `Voice note from ${doctorName}`,
        description: "",
      });
    } else {
      const firstStyle = CARD_STYLE_IDS[type][0];
      // pick a friendly default text when relevant.
      // if current title looks like one of our system texts, replace it when changing type;
      // if it looks custom, keep it.
      const previousTitle = (cardDraft.title || "").trim();
      const ALL_SYSTEM_TEXTS = [...DIET_TEXTS, ...EXERCISE_TEXTS, ...OTC_TEXTS];
      const isVoiceSystemText = previousTitle.startsWith("Voice note from");
      const isSystemText =
        ALL_SYSTEM_TEXTS.includes(previousTitle) || isVoiceSystemText;

      let nextTitle: string | undefined =
        previousTitle && !isSystemText ? previousTitle : "";

      if (!nextTitle) {
        if (type === "diet") {
          nextTitle = DIET_TEXTS[Math.floor(Math.random() * DIET_TEXTS.length)];
        } else if (type === "exercise") {
          nextTitle =
            EXERCISE_TEXTS[Math.floor(Math.random() * EXERCISE_TEXTS.length)];
        } else if (type === "otc") {
          nextTitle = OTC_TEXTS[Math.floor(Math.random() * OTC_TEXTS.length)];
        }
      }
      setCardDraft({
        type,
        visualCategory: type,
        // when changing type, auto-select the first style of that category
        backgroundKey: firstStyle?.id,
        backgroundColor: type === "colors" ? firstStyle?.color : undefined,
        title: nextTitle || "",
        description: cardDraft.description || "",
      });
    }
  };

  const handleCardStyleSelect = (
    category: CardVisualCategory,
    styleId: string,
  ) => {
    const style = CARD_STYLE_IDS[category].find((s) => s.id === styleId);

    setCardDraft((prev) => ({
      ...prev,
      visualCategory: category,
      backgroundKey: style?.id || styleId,
      backgroundColor: category === "colors" ? style?.color : undefined,
    }));
  };

  const handleCardSave = () => {
    if (!cardDraft.type || !cardDraft.backgroundKey) {
      return;
    }
    const isVoice = cardDraft.type === "voice";
    const newCard: PlanCard = {
      id: cardDraft.id || `card-${Date.now()}`,
      type: cardDraft.type,
      title: isVoice
        ? `Voice note from ${doctorName}`
        : (cardDraft.title || "").trim() || "Card Title",
      description: cardDraft.description || "",
      visualCategory:
        (cardDraft.visualCategory as CardVisualCategory) || "abstract",
      backgroundKey: cardDraft.backgroundKey,
      backgroundColor: cardDraft.backgroundColor,
    };
    setCards([newCard]);
    closeCardModal();
  };

  return (
    <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[calc(100vh-8rem)]">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 flex flex-col gap-4 min-h-0">
          <Card
            noPadding
            className="flex-1 overflow-y-auto min-h-0 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:bg-gray-400"
          >
            <div className="space-y-4 p-6">
              {/* Plan Name & Mode Selection */}
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
                <div className="bg-gray-100/50 p-1 rounded-lg inline-flex border border-gray-200/50">
                  <button
                    onClick={() => setMode("create")}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                      mode === "create"
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-500 hover:text-gray-900"
                    }`}
                  >
                    Create
                  </button>
                  <button
                    onClick={() => setMode("import")}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                      mode === "import"
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-500 hover:text-gray-900"
                    }`}
                  >
                    Import
                  </button>
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

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  {mode === "create" ? "Description" : "Description (Optional)"}
                </label>
                <div className="min-h-[120px]">
                  <TiptapEditor
                    content={content}
                    onChange={setContent}
                    placeholder={
                      mode === "create"
                        ? "Describe the clinical goals..."
                        : "Add notes..."
                    }
                  />
                </div>
              </div>

              {mode === "import" ? (
                <div className="border-t border-gray-100 pt-4">
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
                  {/* Package Items Section */}
                  <div className="border-t border-gray-100 pt-4">
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
                            if (oldIndex === -1 || newIndex === -1) {
                              return items;
                            }
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

                  {/* Attachments Section */}
                  <div className="border-t border-gray-100 pt-4">
                    <h2 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <Files size={14} className="text-indigo-500" />
                      Attachments
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {/* Documents Section */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                            <FileUp size={12} className="text-orange-500" />
                            Files ({documents.length})
                          </label>
                        </div>

                        <div className="space-y-1.5">
                          {documents.map((doc, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-2 bg-gray-50 hover:bg-orange-50/50 rounded border border-gray-100 hover:border-orange-200 transition-all group"
                            >
                              <div className="flex items-center gap-2 min-w-0 flex-1">
                                <FileText
                                  size={12}
                                  className="text-orange-600 shrink-0"
                                />
                                <div className="min-w-0 flex-1">
                                  <p className="text-xs font-medium text-gray-800 truncate">
                                    {doc.name}
                                  </p>
                                  <p className="text-[10px] text-gray-400">
                                    {doc.size}
                                  </p>
                                </div>
                              </div>
                              <button
                                onClick={() => removeDocument(index)}
                                className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-all"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          ))}

                          <label className="cursor-pointer block">
                            <div className="flex items-center justify-center gap-1.5 py-2 border-2 border-dashed border-gray-200 rounded hover:border-orange-400 hover:bg-orange-50/30 transition-all group">
                              <PlusCircle
                                size={14}
                                className="text-gray-400 group-hover:text-orange-500"
                              />
                              <span className="text-xs font-semibold text-gray-500 group-hover:text-orange-600">
                                Upload
                              </span>
                            </div>
                            <input
                              type="file"
                              multiple
                              className="sr-only"
                              onChange={handleFileUpload}
                            />
                          </label>
                        </div>
                      </div>

                      {/* Links Section */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                            <Globe size={12} className="text-blue-500" />
                            Links ({links.length})
                          </label>
                        </div>

                        <div className="space-y-1.5">
                          {links.map((link, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-2 bg-gray-50 hover:bg-blue-50/50 rounded border border-gray-100 hover:border-blue-200 transition-all group"
                            >
                              <div className="flex items-center gap-2 min-w-0 flex-1">
                                <LinkIcon
                                  size={12}
                                  className="text-blue-500 shrink-0"
                                />
                                <span className="text-xs text-gray-600 truncate">
                                  {link}
                                </span>
                              </div>
                              <div className="flex items-center gap-0.5 shrink-0">
                                <a
                                  href={link}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-all"
                                >
                                  <ExternalLink size={12} />
                                </a>
                                <button
                                  onClick={() => removeLink(index)}
                                  className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-all"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            </div>
                          ))}

                          <div className="flex gap-1.5">
                            <Input
                              type="url"
                              icon={<LinkIcon size={12} />}
                              value={newLink}
                              onChange={(e) => setNewLink(e.target.value)}
                              onKeyDown={(e) =>
                                e.key === "Enter" && handleAddLink()
                              }
                              placeholder="URL..."
                              className="text-xs flex-1"
                            />
                            <Button
                              onClick={handleAddLink}
                              size="sm"
                              className="bg-blue-600 hover:bg-blue-700 text-white h-8 px-3"
                            >
                              <Plus size={14} />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </Card>

          {/* Action Buttons - Fixed at Bottom (match other forms) */}
          <div className="flex items-center justify-end gap-3 bg-white border-t border-gray-200 py-3 px-6 rounded-lg shadow-sm">
            <Button onClick={onCancel} variant="outline" className="px-6">
              Cancel
            </Button>
            <Button
              onClick={onSubmit}
              className="bg-gray-900 hover:bg-gray-800 text-white px-6"
            >
              {initialData ? "Save Changes" : "Create Plan"}
            </Button>
          </div>
        </div>

        {/* Right Column - Sidebar + Cards */}
        <div className="h-full overflow-y-auto space-y-4 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:bg-gray-400">
          {/* Cards Panel */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-sm font-bold text-gray-900">Card</h2>
                <p className="text-[11px] text-gray-500">
                  One card can be attached to this plan.
                </p>
              </div>
              {cards.length === 0 && (
                <Button
                  onClick={() => openCardModal()}
                  size="sm"
                  className="gap-1.5 bg-gray-900 text-white hover:bg-black h-8 text-xs"
                >
                  <Plus size={14} />
                  Add
                </Button>
              )}
            </div>

            {cards.length === 0 ? (
              <button
                onClick={() => openCardModal()}
                className="w-full flex flex-col items-center justify-center gap-2 py-8 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50 hover:border-gray-400 hover:bg-gray-100/50 transition-all group"
              >
                <div className="h-9 w-9 rounded-full bg-gray-200 group-hover:bg-gray-300 flex items-center justify-center transition-colors">
                  <Plus size={16} className="text-gray-500" />
                </div>
                <p className="text-xs text-gray-400 font-medium group-hover:text-gray-600">
                  Add a card
                </p>
              </button>
            ) : (
              (() => {
                const card = cards[0];
                const category = card.visualCategory as CardVisualCategory;
                const selectedStyle = CARD_STYLE_IDS[category].find(
                  (s) => s.id === card.backgroundKey,
                );
                const cardStyle =
                  category === "colors" && card.backgroundColor
                    ? { backgroundColor: card.backgroundColor }
                    : selectedStyle?.img
                      ? {
                          backgroundImage: `url(${selectedStyle.img})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }
                      : {
                          backgroundImage:
                            "linear-gradient(135deg, #111827, #4b5563)",
                        };

                return (
                  <div className="relative group">
                    <div
                      className="relative rounded-2xl p-4 text-white shadow-sm overflow-hidden min-h-[140px] flex flex-col justify-start items-start text-left"
                      style={cardStyle as React.CSSProperties}
                    >
                      <h3 className="mt-1 text-lg font-bold line-clamp-4">
                        {card.title}
                      </h3>
                      {card.description && (
                        <p className="mt-1 text-sm opacity-90 line-clamp-3">
                          {card.description}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 mt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openCardModal(card)}
                        className="flex-1 h-7 text-xs gap-1"
                      >
                        Edit
                      </Button>
                      <button
                        onClick={() => setCards([])}
                        className="h-7 w-7 flex items-center justify-center rounded-md border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                );
              })()
            )}
          </Card>

          {/* Clinic Selector */}
          <ClinicSelector
            selectedClinics={selectedClinics}
            onSelectionChange={setSelectedClinics}
            selectedCategories={selectedCategories}
            onCategoriesChange={setSelectedCategories}
            userRole={userRole}
          />
        </div>
      </div>

      {/* Product Selector SideSheet */}
      <SideSheet
        isOpen={isProductSheetOpen}
        onClose={() => setIsProductSheetOpen(false)}
        title="Add Package to Plan"
        description="Select packages to include in this plan"
        items={packageItems}
        selectedIds={tempProductIds}
        onSelectionChange={setTempProductIds}
        onConfirm={handleProductSheetConfirm}
        searchPlaceholder="Search packages..."
      />

      {/* Card Creator Side Sheet */}
      {isCardModalOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/20 z-40 transition-opacity"
            onClick={closeCardModal}
          />

          {/* Side Sheet Panel */}
          <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-xl flex flex-col animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="flex items-start justify-between px-5 py-4 border-b border-gray-200 bg-white">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {cardDraft.id ? "Edit Card" : "Add Card"}
                </h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  Customise the card attached to this plan.
                </p>
              </div>
              <button
                onClick={closeCardModal}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full">
              {/* Step 1: Type */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Card type
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: "abstract", label: "Abstract" },
                    { id: "people", label: "People" },
                    { id: "exercise", label: "Exercise" },
                    { id: "diet", label: "Diet" },
                    { id: "otc", label: "OTC" },
                    { id: "colors", label: "Colors" },
                    { id: "voice", label: "Voice Note" },
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => handleCardTypeSelect(t.id as CardType)}
                      className={`px-2 py-2 text-[11px] rounded-lg border text-center transition-all ${
                        cardDraft.type === t.id
                          ? "border-gray-900 bg-gray-900 text-white shadow-sm"
                          : "border-gray-200 bg-white text-gray-700 hover:border-gray-400"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Background (not for voice) */}
              {cardDraft.type && cardDraft.type !== "voice" && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Background
                  </p>
                  <div className="grid grid-cols-6 gap-2">
                    {CARD_STYLE_IDS[cardDraft.type as CardVisualCategory].map(
                      (style) => (
                        <button
                          key={style.id}
                          type="button"
                          onClick={() =>
                            handleCardStyleSelect(
                              cardDraft.type as CardVisualCategory,
                              style.id,
                            )
                          }
                          className={`h-11 rounded-xl border-2 overflow-hidden transition-all ${
                            cardDraft.backgroundKey === style.id
                              ? "border-gray-900 ring-2 ring-gray-900/30 scale-105"
                              : "border-transparent hover:border-gray-300"
                          }`}
                          style={
                            cardDraft.type === "colors" && style.color
                              ? { backgroundColor: style.color }
                              : undefined
                          }
                        >
                          {cardDraft.type !== "colors" && style.img && (
                            <div
                              className="w-full h-full"
                              style={{
                                backgroundImage: `url(${style.img})`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                              }}
                            />
                          )}
                        </button>
                      ),
                    )}
                  </div>
                </div>
              )}

              {/* Step 3: Content + live preview */}
              {cardDraft.type && (
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Preview
                  </p>

                  {/* Live preview */}
                  {(() => {
                    const category =
                      (cardDraft.visualCategory as CardVisualCategory) ||
                      "abstract";
                    const selectedStyle: CardStyleMeta | undefined =
                      cardDraft.backgroundKey
                        ? CARD_STYLE_IDS[category].find(
                            (s) => s.id === cardDraft.backgroundKey,
                          )
                        : undefined;

                    const previewStyle =
                      category === "colors" && cardDraft.backgroundColor
                        ? { backgroundColor: cardDraft.backgroundColor }
                        : selectedStyle?.img
                          ? {
                              backgroundImage: `url(${selectedStyle.img})`,
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                            }
                          : {
                              backgroundImage:
                                "linear-gradient(135deg, #111827, #4b5563)",
                            };

                    const displayTitle =
                      cardDraft.type === "voice"
                        ? `Voice note from ${doctorName}`
                        : cardDraft.title;

                    return (
                      <div
                        className="rounded-2xl px-4 py-4 text-white shadow-sm min-h-[160px] flex flex-col justify-start items-start text-left"
                        style={previewStyle}
                      >
                        <h3 className="text-lg font-bold leading-snug">
                          {displayTitle || (
                            <span className="opacity-40 italic font-normal text-base">
                              Type the card text below…
                            </span>
                          )}
                        </h3>
                      </div>
                    );
                  })()}

                  {cardDraft.type === "voice" ? (
                    <VoiceNoteRecorder />
                  ) : (
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        Text on card
                      </label>
                      <textarea
                        value={cardDraft.title || ""}
                        onChange={(e) =>
                          setCardDraft((prev) => ({
                            ...prev,
                            title: e.target.value,
                          }))
                        }
                        rows={3}
                        className="w-full border border-gray-200 rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 resize-none"
                        placeholder="What should the patient read on this card?"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-5 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">
                  {cardDraft.id ? "Editing card" : "New card"}
                </span>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={closeCardModal}>
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleCardSave}
                    disabled={!cardDraft.type || !cardDraft.backgroundKey}
                    className="bg-gray-900 text-white hover:bg-black disabled:opacity-40"
                  >
                    {cardDraft.id ? "Save Changes" : "Add Card"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
