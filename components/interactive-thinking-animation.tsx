"use client";

import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, Copy } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Thinking from "./thinking";

interface ColorStop {
  color: string;
  position: number;
  isActive: boolean;
}

function CollapsibleSection({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border rounded-lg mb-4">
      <button
        className="w-full flex justify-between items-center p-4 font-semibold"
        onClick={() => setIsOpen(!isOpen)}
      >
        {title}
        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>
      {isOpen && <div className="p-4 border-t">{children}</div>}
    </div>
  );
}

function FormattedPrompt({
  content,
  onCopy,
}: {
  content: string;
  onCopy: () => void;
}) {
  const [copyText, setCopyText] = useState("Copy");

  const handleCopy = () => {
    onCopy();
    setCopyText("Copied");
    setTimeout(() => setCopyText("Copy"), 1000);
  };

  return (
    <div className="relative">
      <pre className="w-full p-4 font-mono text-sm bg-gray-100 rounded-md whitespace-pre-wrap break-words">
        <code>{content}</code>
      </pre>
      <Button
        variant="outline"
        size="sm"
        className="absolute top-2 right-2"
        onClick={handleCopy}
      >
        <Copy className="h-4 w-4 mr-2" />
        {copyText}
      </Button>
    </div>
  );
}

function createGradientString(colorStops: ColorStop[]): string {
  const activeStops = colorStops.filter((stop) => stop.isActive);
  const sortedStops = [...activeStops].sort((a, b) => a.position - b.position);

  if (sortedStops.length < 2) {
    sortedStops.push({ ...sortedStops[0], position: 100 });
  }

  const gradientParts = sortedStops.map(
    (stop) => `${stop.color} ${stop.position}%`
  );
  const repeatedGradient = [...gradientParts, ...gradientParts].join(", ");
  return `linear-gradient(to right, ${repeatedGradient})`;
}

export default function InteractiveThinkingAnimation() {
  const [colorStops, setColorStops] = useState<ColorStop[]>([
    { color: "#000000", position: 0, isActive: true },
    { color: "#903bf7", position: 20, isActive: true },
    { color: "#42f09f", position: 50, isActive: true },
    { color: "#000000", position: 51, isActive: true },
    { color: "#000000", position: 60, isActive: false },
    { color: "#000000", position: 70, isActive: false },
    { color: "#000000", position: 80, isActive: false },
    { color: "#000000", position: 90, isActive: false },
    { color: "#000000", position: 100, isActive: false },
  ]);
  const [animationDuration, setAnimationDuration] = useState(1.4);
  const [fontSize, setFontSize] = useState(25);
  const [prompt, setPrompt] = useState("");
  const [thinkingText, setThinkingText] = useState("Thinking...");
  const [gradientString, setGradientString] = useState("");

  useEffect(() => {
    updatePrompt(colorStops);
    setGradientString(createGradientString(colorStops));
  }, [colorStops, animationDuration, fontSize, thinkingText]);

  const handleColorChange = (index: number, color: string) => {
    setColorStops((stops) =>
      stops.map((stop, i) => (i === index ? { ...stop, color } : stop))
    );
  };

  const handlePositionChange = (index: number, position: number) => {
    setColorStops((stops) =>
      stops.map((stop, i) => (i === index ? { ...stop, position } : stop))
    );
  };

  const toggleColorStop = (index: number) => {
    setColorStops((stops) =>
      stops.map((stop, i) =>
        i === index ? { ...stop, isActive: !stop.isActive } : stop
      )
    );
  };

  const updatePrompt = (allStops: ColorStop[]) => {
    const colorStopsList = allStops
      .map(
        (stop, index) =>
          `  - Color ${index + 1}: ${stop.color}, Position: ${stop.position}%${
            stop.isActive ? "" : " (disabled)"
          }`
      )
      .join("\n");

    const newPrompt = `Please update the default values in interactive-thinking-animation.tsx:

## Configuration
- Text: "${thinkingText}"
- Animation Duration: ${animationDuration}s
- Font Size: ${fontSize}px

## Color Stops
${colorStopsList}`;

    setPrompt(newPrompt);
  };

  const copyPromptToClipboard = () => {
    navigator.clipboard.writeText(prompt);
  };

  const activeColorStops = colorStops.filter((stop) => stop.isActive);

  return (
    <div className="space-y-8 p-6 rounded-lg relative">
      <div className="sticky top-0 bg-transparent z-[1337] flex justify-center items-start pt-4">
        <div className="bg-white rounded-full p-4 shadow-md inline-block">
          <Thinking
            text={thinkingText}
            fontSize={fontSize}
            animationDuration={animationDuration}
            colorStops={activeColorStops}
          />
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg">
        <CollapsibleSection title="Configuration">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Label htmlFor="thinkingText" className="w-24">
                Text:
              </Label>
              <Input
                id="thinkingText"
                value={thinkingText}
                onChange={(e) => setThinkingText(e.target.value)}
                className="flex-grow"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Label htmlFor="duration" className="w-24">
                Duration:
              </Label>
              <Slider
                id="duration"
                min={0.5}
                max={5}
                step={0.1}
                value={[animationDuration]}
                onValueChange={(value) => setAnimationDuration(value[0])}
                className="flex-grow"
              />
              <span className="w-16 text-right">
                {animationDuration.toFixed(1)}s
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Label htmlFor="fontSize" className="w-24">
                Font Size:
              </Label>
              <Slider
                id="fontSize"
                min={8}
                max={100}
                step={1}
                value={[fontSize]}
                onValueChange={(value) => setFontSize(value[0])}
                className="flex-grow"
              />
              <span className="w-16 text-right">{fontSize}px</span>
            </div>
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="Color Stops">
          {colorStops.map((stop, index) => (
            <div key={index} className="flex items-center space-x-4 mb-4">
              <Switch
                checked={stop.isActive}
                onCheckedChange={() => toggleColorStop(index)}
              />
              <input
                type="color"
                value={stop.color}
                onChange={(e) => handleColorChange(index, e.target.value)}
                className={`w-10 h-10 rounded ${
                  !stop.isActive && "opacity-50 cursor-not-allowed"
                }`}
                disabled={!stop.isActive}
                aria-label={`Choose color for stop ${index + 1}`}
              />
              <div className="flex-grow flex items-center space-x-2">
                <Slider
                  min={0}
                  max={100}
                  step={1}
                  value={[stop.position]}
                  onValueChange={(value) =>
                    handlePositionChange(index, value[0])
                  }
                  disabled={!stop.isActive}
                  className={!stop.isActive ? "opacity-50" : ""}
                  aria-label={`Adjust position of color stop ${index + 1}`}
                />
                <span className="w-12 text-right">{stop.position}%</span>
              </div>
            </div>
          ))}
        </CollapsibleSection>

        <CollapsibleSection title="Debug Gradient">
          <div className="h-16 rounded debug-gradient" aria-hidden="true" />
        </CollapsibleSection>

        <CollapsibleSection title="Prompt" defaultOpen={false}>
          <FormattedPrompt content={prompt} onCopy={copyPromptToClipboard} />
        </CollapsibleSection>

        <CollapsibleSection title="How to Use">
          <p className="mb-4">
            To use the Thinking component in your project, import it and pass
            the necessary props:
          </p>
          <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
            <code>{`import Thinking from './thinking'

function YourComponent() {
  return (
    <div className="bg-white rounded-full p-4 shadow-md inline-block">
      <Thinking
        text="${thinkingText}"
        fontSize={${fontSize}}
        animationDuration={${animationDuration}}
        colorStops={[
${activeColorStops
  .map(
    (stop) => `          { color: "${stop.color}", position: ${stop.position} }`
  )
  .join(",\n")}
        ]}
      />
    </div>
  )
}`}</code>
          </pre>
          <p className="mt-4">
            The props will update automatically as you adjust the values in the
            UI above.
          </p>
        </CollapsibleSection>

        <CollapsibleSection title="How It Works" defaultOpen={false}>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              The animation uses a CSS linear gradient with multiple color stops
            </li>
            <li>
              The gradient is set to be twice the width of the container (200%)
            </li>
            <li>
              An animation is applied to move the background position from 200%
              to 0%
            </li>
            <li>This creates the illusion of a continuously moving gradient</li>
            <li>
              The gradient is applied as a background, while the text itself is
              made transparent to reveal the gradient underneath
            </li>
            <li>
              The CSS property <code>background-clip: text</code> is used to
              apply the gradient only to the text characters
            </li>
            <li>
              The animation duration controls the speed of the gradient movement
            </li>
          </ul>
        </CollapsibleSection>
      </div>

      <style jsx>{`
        .debug-gradient {
          background: ${gradientString};
          background-size: 200% 100%;
          animation: gradient-animation ${animationDuration}s linear infinite;
        }

        @keyframes gradient-animation {
          0% {
            background-position: 200% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .debug-gradient {
            animation: none;
            background-position: 0% 50%;
          }
        }
      `}</style>
    </div>
  );
}
