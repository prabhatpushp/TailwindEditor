"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAISettingsStore, DEFAULT_SETTINGS } from "@/lib/ai-settings-store";
import { Eye, EyeOff, KeyRound, Sparkles, RotateCcw, ExternalLink, ShieldCheck, Check } from "lucide-react";

const AVAILABLE_MODELS = [
    { value: "gemini-3.1-flash-lite", label: "Gemini 3.1 Flash Lite", description: "Fast" },
    { value: "gemini-3-flash-preview", label: "Gemini 3.1 Flash Preview", description: "Capable" },
];

export function AISettingsDialog() {
    const { apiKey, systemPrompt, temperature, maxOutputTokens, model, topP, topK, isSettingsDialogOpen, setApiKey, removeApiKey, updateSettings, resetSettings, closeSettingsDialog } =
        useAISettingsStore();

    // Local state for form editing
    const [localKey, setLocalKey] = useState("");
    const [showKey, setShowKey] = useState(false);
    const [keySaved, setKeySaved] = useState(false);
    const [localPrompt, setLocalPrompt] = useState(systemPrompt);
    const [localTemp, setLocalTemp] = useState(temperature);
    const [localMaxTokens, setLocalMaxTokens] = useState(maxOutputTokens);
    const [localModel, setLocalModel] = useState(model);
    const [localTopP, setLocalTopP] = useState(topP);
    const [localTopK, setLocalTopK] = useState(topK);

    // Sync local state when dialog opens
    useEffect(() => {
        if (isSettingsDialogOpen) {
            setLocalKey(apiKey);
            setLocalPrompt(systemPrompt);
            setLocalTemp(temperature);
            setLocalMaxTokens(maxOutputTokens);
            setLocalModel(model);
            setLocalTopP(topP);
            setLocalTopK(topK);
            setKeySaved(false);
            setShowKey(false);
        }
    }, [isSettingsDialogOpen, apiKey, systemPrompt, temperature, maxOutputTokens, model, topP, topK]);

    const handleSave = async () => {
        await setApiKey(localKey);
        updateSettings({
            systemPrompt: localPrompt,
            temperature: localTemp,
            maxOutputTokens: localMaxTokens,
            model: localModel,
            topP: localTopP,
            topK: localTopK,
        });
        closeSettingsDialog();
    };

    const handleSaveKey = async () => {
        await setApiKey(localKey);
        setKeySaved(true);
        setTimeout(() => setKeySaved(false), 2000);
    };

    const handleRemoveKey = () => {
        removeApiKey();
        setLocalKey("");
    };

    const handleReset = () => {
        setLocalPrompt(DEFAULT_SETTINGS.systemPrompt);
        setLocalTemp(DEFAULT_SETTINGS.temperature);
        setLocalMaxTokens(DEFAULT_SETTINGS.maxOutputTokens);
        setLocalModel(DEFAULT_SETTINGS.model);
        setLocalTopP(DEFAULT_SETTINGS.topP);
        setLocalTopK(DEFAULT_SETTINGS.topK);
    };

    const maskKey = (key: string) => {
        if (!key) return "";
        if (key.length <= 8) return "•".repeat(key.length);
        return key.slice(0, 4) + "•".repeat(key.length - 8) + key.slice(-4);
    };

    return (
        <Dialog open={isSettingsDialogOpen} onOpenChange={(open) => !open && closeSettingsDialog()}>
            <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-hidden flex flex-col">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        AI Settings
                    </DialogTitle>
                    <DialogDescription>Configure your API key and AI model parameters. Your key is encrypted and stored locally in your browser.</DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="api-key" className="flex-1 min-h-0">
                    <TabsList className="w-full">
                        <TabsTrigger value="api-key" className="flex-1 text-xs">
                            <KeyRound className="w-3 h-3 mr-1.5" />
                            API Key
                        </TabsTrigger>
                        <TabsTrigger value="model" className="flex-1 text-xs">
                            <Sparkles className="w-3 h-3 mr-1.5" />
                            Model & Prompt
                        </TabsTrigger>
                    </TabsList>

                    {/* ── API Key Tab ───────────────────────────────── */}
                    <TabsContent value="api-key" className="mt-3 space-y-4 overflow-y-auto max-h-[50vh] custom-scrollbar pr-1">
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="api-key-input" className="text-xs font-medium">
                                    Google Gemini API Key
                                </Label>
                                <a
                                    href="https://aistudio.google.com/apikey"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-[10px] text-primary hover:underline"
                                >
                                    Get a free key
                                    <ExternalLink className="w-2.5 h-2.5" />
                                </a>
                            </div>
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <Input
                                        id="api-key-input"
                                        type={showKey ? "text" : "password"}
                                        placeholder="AIzaSy..."
                                        value={localKey}
                                        onChange={(e) => setLocalKey(e.target.value)}
                                        className="pr-10 font-mono text-xs"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowKey(!showKey)}
                                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {showKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                    </button>
                                </div>
                                <Button size="sm" variant={keySaved ? "default" : "outline"} onClick={handleSaveKey} disabled={!localKey.trim()} className="shrink-0">
                                    {keySaved ? (
                                        <>
                                            <Check className="w-3 h-3 mr-1" />
                                            Saved
                                        </>
                                    ) : (
                                        "Save Key"
                                    )}
                                </Button>
                            </div>
                            {apiKey && (
                                <div className="flex items-center justify-between text-[10px] text-muted-foreground bg-muted/50 rounded-md px-3 py-2 border border-border/30">
                                    <span className="font-mono">{maskKey(apiKey)}</span>
                                    <button onClick={handleRemoveKey} className="text-destructive hover:underline font-medium ml-2">
                                        Remove
                                    </button>
                                </div>
                            )}
                        </div>

                        <Separator />

                        <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg border border-border/30">
                            <ShieldCheck className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                            <div className="space-y-1">
                                <p className="text-[11px] font-medium">Your key stays private</p>
                                <p className="text-[10px] text-muted-foreground leading-relaxed">
                                    Your API key is encrypted with AES-256 and stored locally in your browser. It is sent directly to Google's API — never to our servers. You can remove it anytime.
                                </p>
                            </div>
                        </div>
                    </TabsContent>

                    {/* ── Model & Prompt Tab ────────────────────────── */}
                    <TabsContent value="model" className="mt-3 space-y-4 overflow-y-auto max-h-[50vh] custom-scrollbar pr-1">
                        {/* Model Selection */}
                        <div className="space-y-2">
                            <Label className="text-xs font-medium">Model</Label>
                            <Select value={localModel} onValueChange={setLocalModel}>
                                <SelectTrigger className="text-xs">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {AVAILABLE_MODELS.map((m) => (
                                        <SelectItem key={m.value} value={m.value} className="text-xs">
                                            <div className="flex items-center gap-2">
                                                <span>{m.label}</span>
                                                <Badge variant="secondary" className="text-[9px] px-1.5 py-0">
                                                    {m.description}
                                                </Badge>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* System Prompt */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label className="text-xs font-medium">System Prompt</Label>
                                <button onClick={() => setLocalPrompt(DEFAULT_SETTINGS.systemPrompt)} className="text-[10px] text-muted-foreground hover:text-foreground transition-colors">
                                    Reset to default
                                </button>
                            </div>
                            <Textarea
                                value={localPrompt}
                                onChange={(e) => setLocalPrompt(e.target.value)}
                                placeholder="You are a helpful AI assistant..."
                                className="min-h-[100px] max-h-[160px] text-xs font-mono resize-y"
                            />
                        </div>

                        <Separator />

                        {/* Temperature */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label className="text-xs font-medium">Temperature</Label>
                                <span className="text-xs text-muted-foreground font-mono">{localTemp.toFixed(2)}</span>
                            </div>
                            <Slider value={[localTemp]} onValueChange={([v]) => setLocalTemp(v)} min={0} max={2} step={0.05} className="w-full" />
                            <p className="text-[10px] text-muted-foreground">Lower = more focused and deterministic. Higher = more creative and varied.</p>
                        </div>

                        {/* Top P */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label className="text-xs font-medium">Top P</Label>
                                <span className="text-xs text-muted-foreground font-mono">{localTopP.toFixed(2)}</span>
                            </div>
                            <Slider value={[localTopP]} onValueChange={([v]) => setLocalTopP(v)} min={0} max={1} step={0.05} className="w-full" />
                        </div>

                        {/* Top K */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label className="text-xs font-medium">Top K</Label>
                                <span className="text-xs text-muted-foreground font-mono">{localTopK}</span>
                            </div>
                            <Slider value={[localTopK]} onValueChange={([v]) => setLocalTopK(v)} min={1} max={100} step={1} className="w-full" />
                        </div>

                        {/* Max Output Tokens */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label className="text-xs font-medium">Max Output Tokens</Label>
                                <span className="text-xs text-muted-foreground font-mono">{localMaxTokens.toLocaleString()}</span>
                            </div>
                            <Slider value={[localMaxTokens]} onValueChange={([v]) => setLocalMaxTokens(v)} min={256} max={65536} step={256} className="w-full" />
                        </div>
                    </TabsContent>
                </Tabs>

                <DialogFooter className="pt-2 border-t border-border/30">
                    <Button variant="ghost" size="sm" onClick={handleReset} className="mr-auto text-xs">
                        <RotateCcw className="w-3 h-3 mr-1.5" />
                        Reset All
                    </Button>
                    <Button variant="outline" size="sm" onClick={closeSettingsDialog} className="text-xs">
                        Cancel
                    </Button>
                    <Button size="sm" onClick={handleSave} className="text-xs">
                        Save Settings
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
