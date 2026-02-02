import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle } from
'../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Bot, Sliders, MessageSquare, Save } from 'lucide-react';
export function HealthAssistant() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-medium text-gray-900">
            Health Assistant Configuration
          </h2>
          <p className="text-sm text-gray-500">
            Customize the persona and capabilities of the patient-facing LLM.
          </p>
        </div>
        <Button>
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configuration Panel */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot size={20} className="text-blue-600" />
                Persona Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assistant Name
                </label>
                <Input defaultValue="MediBot" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tone of Voice
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {['Professional', 'Empathetic', 'Casual'].map((tone) =>
                  <button
                    key={tone}
                    className={`px-4 py-2 text-sm font-medium rounded-md border ${tone === 'Empathetic' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'}`}>

                      {tone}
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  System Prompt
                </label>
                <textarea
                  className="w-full min-h-[150px] p-3 rounded-md border border-gray-200 text-sm font-mono text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  defaultValue="You are a helpful and empathetic medical assistant. Your goal is to help patients adhere to their treatment protocols. Always be encouraging but firm about medical adherence. Never give medical diagnoses." />

              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sliders size={20} className="text-purple-600" />
                Safety & Constraints
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">
                    Emergency Escalation
                  </h4>
                  <p className="text-xs text-gray-500">
                    Automatically alert clinic if pain score exceeds 8
                  </p>
                </div>
                <div className="relative inline-block w-10 h-6 transition duration-200 ease-in-out bg-blue-600 rounded-full cursor-pointer">
                  <span className="absolute left-5 inline-block w-4 h-4 mt-1 ml-1 bg-white rounded-full shadow transform transition-transform"></span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">
                    Medical Advice Restriction
                  </h4>
                  <p className="text-xs text-gray-500">
                    Prevent AI from suggesting medication changes
                  </p>
                </div>
                <div className="relative inline-block w-10 h-6 transition duration-200 ease-in-out bg-blue-600 rounded-full cursor-pointer">
                  <span className="absolute left-5 inline-block w-4 h-4 mt-1 ml-1 bg-white rounded-full shadow transform transition-transform"></span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview Panel */}
        <div className="lg:col-span-1">
          <Card className="h-full flex flex-col">
            <CardHeader className="border-b border-gray-100 bg-gray-50/50">
              <CardTitle className="text-sm font-medium text-gray-500">
                Live Preview
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-0">
              <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-gray-50/30 min-h-[400px]">
                <div className="flex gap-3">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                    <Bot size={16} />
                  </div>
                  <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 text-sm text-gray-800">
                    Hello Sarah! How are you feeling today? Don't forget to take
                    your medication after lunch.
                  </div>
                </div>

                <div className="flex gap-3 flex-row-reverse">
                  <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 flex-shrink-0">
                    SJ
                  </div>
                  <div className="bg-blue-600 p-3 rounded-2xl rounded-tr-none shadow-sm text-sm text-white">
                    I'm feeling a bit tired today, but I took my meds.
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                    <Bot size={16} />
                  </div>
                  <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 text-sm text-gray-800">
                    That's good that you're staying on track! Fatigue can be
                    normal at this stage. Have you been drinking enough water?
                  </div>
                </div>
              </div>

              <div className="p-3 border-t border-gray-100 bg-white">
                <div className="relative">
                  <Input placeholder="Type a message..." className="pr-10" />
                  <button className="absolute right-2 top-2 text-blue-600 hover:text-blue-700">
                    <MessageSquare size={18} />
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>);

}