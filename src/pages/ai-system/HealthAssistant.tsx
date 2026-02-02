import { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import {
  Bot,
  Save,
  Smartphone,
  MessageCircle,
  Upload,
  X,
  Check } from
'lucide-react';

export function HealthAssistant() {
  const [chatChannel, setChatChannel] = useState<'native' | 'whatsapp'>('native');
  const [clinicName, setClinicName] = useState('Clinic Rep');
  const [colorTheme, setColorTheme] = useState('#bf9b30'); // Default gold/brown from image
  const [logo, setLogo] = useState<string | null>(null);

  // Assistant Name State
  const [assistantName, setAssistantName] = useState('MediBot');

  const handleLogoUpload = () => {
    // Mock upload
    setLogo('https://api.dicebear.com/7.x/icons/svg?seed=medicore');
  };

  const themes = [
    { name: 'Gold', value: '#bf9b30' },
    { name: 'Blue', value: '#2563eb' },
    { name: 'Green', value: '#059669' },
    { name: 'Purple', value: '#7c3aed' },
    { name: 'Navy', value: '#1e293b' },
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-10">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">
            Health Assistant Configuration
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Configure how your patient-facing AI assistant appears and behaves.
          </p>
        </div>
        <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
          <Save className="mr-2 h-4 w-4" />
          Save Configuration
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Settings Panel */}
        <div className="lg:col-span-8 space-y-6">

          {/* Channel Selection */}
          <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-sm font-medium text-gray-900 mb-4">Select Chat Channel</h3>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => setChatChannel('native')}
                className={`flex items-center gap-3 px-5 py-3 rounded-lg border transition-all ${chatChannel === 'native' ? 'border-blue-600 bg-blue-50/50 text-blue-700 ring-1 ring-blue-600/20' : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'}`}>
                <div className={`p-2 rounded-full ${chatChannel === 'native' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
                  <Smartphone size={18} />
                </div>
                <div className="text-left">
                  <span className="block text-sm font-semibold">Tesigo (Native App)</span>
                  <span className="block text-xs opacity-80">In-app chat experience</span>
                </div>
                {chatChannel === 'native' && <div className="ml-2 h-4 w-4 bg-blue-600 rounded-full flex items-center justify-center"><Check size={10} className="text-white" /></div>}
              </button>

              <button
                onClick={() => setChatChannel('whatsapp')}
                className={`flex items-center gap-3 px-5 py-3 rounded-lg border transition-all ${chatChannel === 'whatsapp' ? 'border-green-600 bg-green-50/50 text-green-700 ring-1 ring-green-600/20' : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'}`}>
                <div className={`p-2 rounded-full ${chatChannel === 'whatsapp' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                  <MessageCircle size={18} />
                </div>
                <div className="text-left">
                  <span className="block text-sm font-semibold">WhatsApp (Twilio)</span>
                  <span className="block text-xs opacity-80">External messaging</span>
                </div>
                {chatChannel === 'whatsapp' && <div className="ml-2 h-4 w-4 bg-green-600 rounded-full flex items-center justify-center"><Check size={10} className="text-white" /></div>}
              </button>
            </div>
          </section>

          {/* Configuration Fields */}
          <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              {chatChannel === 'native' ? 'App Configuration' : 'WhatsApp Configuration'}
            </h3>

            {chatChannel === 'native' ? (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">Clinic Representative Name</label>
                    <Input
                      value={clinicName}
                      onChange={(e) => setClinicName(e.target.value)}
                      className="max-w-md"
                      placeholder="e.g. Dr. Smith's Office" />
                    <p className="text-xs text-gray-500">Displayed as the sender name in the chat header.</p>
                  </div>

                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">Assistant Name</label>
                    <Input
                      value={assistantName}
                      onChange={(e) => setAssistantName(e.target.value)}
                      className="max-w-md"
                      placeholder="e.g. MediBot" />
                    <p className="text-xs text-gray-500">Name of the AI assistant.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">Clinic Logo</label>
                    <div className="flex items-center gap-4">
                      {logo ? (
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded-lg border border-gray-200 p-1 bg-white">
                            <img src={logo} alt="Logo" className="w-full h-full object-contain" />
                          </div>
                          <div>
                            <span className="block text-xs font-medium text-green-600 mb-1">Logo Uploaded</span>
                            <button
                              onClick={() => setLogo(null)}
                              className="text-xs text-red-500 hover:text-red-600 flex items-center gap-1">
                              <X size={12} /> Remove
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={handleLogoUpload}
                          className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors bg-gray-50/50">
                          <Upload size={16} />
                          Upload Logo
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">Color Theme</label>
                    <div className="flex items-center gap-4">
                      <div
                        className="h-10 w-10 rounded-lg border border-gray-200 shadow-sm"
                        style={{ backgroundColor: colorTheme }} />
                      <div className="flex gap-2">
                        {themes.map((theme) => (
                          <button
                            key={theme.name}
                            onClick={() => setColorTheme(theme.value)}
                            className={`h-8 w-8 rounded-full border-2 transition-all ${colorTheme === theme.value ? 'border-gray-400 scale-110' : 'border-transparent hover:scale-110'}`}
                            style={{ backgroundColor: theme.value }}
                            title={theme.name} />
                        ))}
                      </div>
                      <div className="text-xs text-gray-500 ml-2">
                        {colorTheme}
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">Theme color will be applied in the actual app. Preview shows B&W design.</p>
                  </div>
                </div>
              </div>
            ) : (
               <div className="space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Twilio Account SID</label>
                      <Input type="password" placeholder="Checking accounts..." />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Auth Token</label>
                      <Input type="password" placeholder="••••••••••••••••" />
                    </div>
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Phone Number</label>
                    <Input placeholder="+1 (555) 000-0000" className="max-w-md" />
                 </div>
                 <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-3 text-xs text-yellow-800">
                   Note: WhatsApp styling is limited by the platform. Custom colors and logos may not appear in all contexts.
                 </div>
               </div>
            )}
          </section>
        </div>

        {/* Live Preview Panel */}
        <div className="lg:col-span-4">
          <div className="sticky top-24">
             <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-700">Live Preview</h3>
                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                  {chatChannel === 'native' ? 'iOS / Android' : 'WhatsApp'}
                </span>
             </div>

             {/* Phone Shell */}
             <div className="border border-gray-300 rounded-[2.5rem] overflow-hidden bg-white shadow-xl max-w-[320px] mx-auto h-[600px] flex flex-col relative">
                {/* Status Bar */}
                <div className="h-7 bg-black text-white flex justify-between items-center px-6 text-[10px] font-medium z-10">
                   <span>9:41</span>
                   <div className="flex gap-1.5">
                     <div className="w-3 h-3 rounded-full border border-current opacity-60" />
                     <div className="w-3 h-3 rounded-full border border-current opacity-60" />
                   </div>
                </div>

                {/* App Header */}
                <div
                  className="p-4 flex items-center justify-between shadow-sm z-10 transition-colors duration-300"
                  style={{ backgroundColor: chatChannel === 'native' ? 'white' : '#075E54' }}>
                   <div className="flex items-center gap-3">
                     {chatChannel === 'native' ? (
                        <>
                          {logo ? (
                            <img src={logo} className="h-8 w-8 rounded-full object-cover border border-gray-100" />
                          ) : (
                             <div className="h-8 w-8 rounded-full flex items-center justify-center text-white text-xs font-bold bg-gray-900">
                               CR
                             </div>
                          )}
                           <div>
                              <p className="text-sm font-bold text-gray-900 leading-tight">{clinicName}</p>
                           </div>
                        </>
                     ) : (
                        <div className="flex items-center gap-2 text-white">
                           <div className="h-8 w-8 bg-white/20 rounded-full flex items-center justify-center">
                             <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" className="h-5 w-5" />
                           </div>
                           <span className="font-semibold text-sm">Business Account</span>
                        </div>
                     )}
                   </div>
                </div>

                {/* Chat Area */}
                <div
                   className="flex-1 bg-cover bg-center overflow-y-auto p-4 space-y-4"
                   style={{
                     backgroundColor: chatChannel === 'native' ? '#f8fafc' : '#efeae2',
                     // WhatsApp-like background pattern (subtle)
                     backgroundImage: chatChannel === 'whatsapp' ? 'radial-gradient(#d4d0c5 1px, transparent 1px)' : 'none',
                     backgroundSize: '20px 20px'
                   }}>

                   {/* Date Divider */}
                   <div className="flex justify-center my-2">
                     <span className="text-[10px] bg-black/5 text-gray-500 px-2 py-0.5 rounded shadow-sm">Today</span>
                   </div>

                   {/* Bot Message */}
                   <div className="flex items-end gap-2">
                     {chatChannel === 'native' && (
                        <div className="w-6 h-6 rounded-full flex items-center justify-center text-white flex-shrink-0 text-[10px] bg-gray-900">
                          <Bot size={12} />
                        </div>
                     )}
                     <div
                        className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed shadow-sm ${chatChannel === 'native' ? 'rounded-bl-none bg-white text-gray-800 border-l-3 border-l-gray-900' : 'bg-white text-gray-900 rounded-tl-none'}`}>
                        Hello Sarah! How are you feeling today? Don't forget to take your medication after lunch.
                        <div className="text-[9px] text-gray-300 mt-1 text-right">10:02 AM</div>
                     </div>
                   </div>

                   {/* User Message */}
                   <div className="flex flex-col items-end gap-1">
                      <div
                         className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed shadow-sm text-white rounded-br-none ${chatChannel === 'native' ? 'bg-gray-900' : 'bg-[#005c4b]'}`}>
                         I'm feeling a bit tired today, but I took my meds.
                         <div className="text-[9px] text-white/60 mt-1 text-right flex items-center justify-end gap-0.5">
                           10:05 AM
                           {chatChannel === 'whatsapp' && <Check size={8} />}
                         </div>
                      </div>
                   </div>
                </div>

                {/* Input Area */}
                <div className="p-3 bg-white border-t border-gray-100">
                   <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                        <Upload size={14} />
                      </div>
                      <div className="flex-1 bg-gray-100 h-9 rounded-full px-3 flex items-center text-xs text-gray-400">
                        Type a message...
                      </div>
                      <div
                        className={`h-9 w-9 rounded-full flex items-center justify-center text-white shadow-sm ${chatChannel === 'native' ? 'bg-gray-900' : 'bg-[#005c4b]'}`}>
                         <Smartphone size={16} />
                      </div>
                   </div>
                </div>

                {/* Home Indicator */}
                <div className="h-1 bg-gray-900 mx-auto w-1/3 rounded-full my-2 opacity-20" />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}