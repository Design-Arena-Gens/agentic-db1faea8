"use client";

import { useState, useRef, useEffect } from "react";
import { Mic, MicOff, Phone, MapPin, Calendar, Send } from "lucide-react";

interface Message {
  id: string;
  type: "user" | "agent" | "system";
  content: string;
  timestamp: Date;
  action?: {
    type: string;
    status: string;
    details?: any;
  };
}

export default function Home() {
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "system",
      content: "Jarvis AI Agent initialized. Say 'Hey Jarvis' to activate.",
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [recognition, setRecognition] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = "en-US";

      recognitionInstance.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result) => result.transcript)
          .join("");

        if (event.results[0].isFinal) {
          handleVoiceCommand(transcript);
        }
      };

      recognitionInstance.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const addMessage = (
    type: "user" | "agent" | "system",
    content: string,
    action?: any
  ) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date(),
      action,
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const handleVoiceCommand = async (command: string) => {
    const lowerCommand = command.toLowerCase();

    // Check for wake word
    if (!lowerCommand.includes("jarvis") && !lowerCommand.includes("hey jarvis")) {
      return;
    }

    addMessage("user", command);
    await processCommand(command);
  };

  const processCommand = async (command: string) => {
    const lowerCommand = command.toLowerCase();

    // Intent detection and routing
    if (lowerCommand.includes("call") && lowerCommand.includes("daddy")) {
      await handleCallAction("Daddy");
    } else if (lowerCommand.includes("open") && lowerCommand.includes("google map")) {
      const location = extractLocation(command);
      await handleMapAction(location);
    } else if (lowerCommand.includes("appointment") || lowerCommand.includes("schedule")) {
      const appointmentDetails = extractAppointmentDetails(command);
      await handleAppointmentAction(appointmentDetails);
    } else if (lowerCommand.includes("search") || lowerCommand.includes("find")) {
      const query = extractSearchQuery(command);
      await handleSearchAction(query);
    } else if (lowerCommand.includes("weather")) {
      await handleWeatherAction();
    } else if (lowerCommand.includes("remind me") || lowerCommand.includes("reminder")) {
      const reminder = extractReminder(command);
      await handleReminderAction(reminder);
    } else if (lowerCommand.includes("send message") || lowerCommand.includes("text")) {
      const messageDetails = extractMessageDetails(command);
      await handleMessageAction(messageDetails);
    } else if (lowerCommand.includes("play") || lowerCommand.includes("music")) {
      const song = extractSong(command);
      await handleMusicAction(song);
    } else {
      await handleGeneralQuery(command);
    }
  };

  const handleCallAction = async (contact: string) => {
    addMessage(
      "agent",
      `Initiating call to ${contact}...`,
      { type: "call", status: "connecting", details: { contact } }
    );

    // Simulate API call
    setTimeout(() => {
      addMessage(
        "agent",
        `Call connected to ${contact}. Duration: simulated mode (no actual call made).`,
        { type: "call", status: "connected", details: { contact } }
      );
    }, 2000);
  };

  const handleMapAction = async (location: string) => {
    addMessage(
      "agent",
      `Opening Google Maps for "${location}" and starting navigation...`,
      { type: "navigation", status: "opening", details: { location } }
    );

    // Simulate opening maps
    setTimeout(() => {
      const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        location
      )}`;
      addMessage(
        "agent",
        `Navigation started to ${location}. In a real implementation, this would open: ${mapsUrl}`,
        { type: "navigation", status: "active", details: { location, url: mapsUrl } }
      );
    }, 1500);
  };

  const handleAppointmentAction = async (details: any) => {
    addMessage(
      "agent",
      `Checking availability for ${details.service} on ${details.date} at ${details.time}...`,
      { type: "appointment", status: "checking", details }
    );

    // Simulate appointment booking
    setTimeout(() => {
      const available = Math.random() > 0.3;
      if (available) {
        addMessage(
          "agent",
          `Great! I found an available slot at ${details.location} on ${details.date} at ${details.time}. Appointment confirmed!`,
          { type: "appointment", status: "confirmed", details }
        );
      } else {
        addMessage(
          "agent",
          `Sorry, ${details.time} is not available. Alternative slots: 1:00 PM, 3:00 PM, 4:30 PM. Which would you prefer?`,
          { type: "appointment", status: "alternatives", details }
        );
      }
    }, 2000);
  };

  const handleSearchAction = async (query: string) => {
    addMessage(
      "agent",
      `Searching for "${query}"...`,
      { type: "search", status: "searching", details: { query } }
    );

    setTimeout(() => {
      addMessage(
        "agent",
        `Here are the top results for "${query}": [Simulated search results would appear here]`,
        { type: "search", status: "completed", details: { query } }
      );
    }, 1500);
  };

  const handleWeatherAction = async () => {
    addMessage(
      "agent",
      "Checking current weather...",
      { type: "weather", status: "fetching" }
    );

    setTimeout(() => {
      addMessage(
        "agent",
        "Current weather: 72°F, Partly Cloudy. High: 78°F, Low: 65°F. Good day ahead!",
        { type: "weather", status: "completed" }
      );
    }, 1500);
  };

  const handleReminderAction = async (reminder: any) => {
    addMessage(
      "agent",
      `Setting reminder: "${reminder.text}" for ${reminder.time}`,
      { type: "reminder", status: "setting", details: reminder }
    );

    setTimeout(() => {
      addMessage(
        "agent",
        `Reminder set successfully! I'll notify you ${reminder.time}.`,
        { type: "reminder", status: "confirmed", details: reminder }
      );
    }, 1000);
  };

  const handleMessageAction = async (details: any) => {
    addMessage(
      "agent",
      `Sending message to ${details.recipient}: "${details.message}"`,
      { type: "message", status: "sending", details }
    );

    setTimeout(() => {
      addMessage(
        "agent",
        `Message sent successfully to ${details.recipient}.`,
        { type: "message", status: "sent", details }
      );
    }, 1500);
  };

  const handleMusicAction = async (song: string) => {
    addMessage(
      "agent",
      `Playing "${song}"...`,
      { type: "music", status: "playing", details: { song } }
    );

    setTimeout(() => {
      addMessage(
        "agent",
        `Now playing: ${song}. Enjoy your music!`,
        { type: "music", status: "active", details: { song } }
      );
    }, 1000);
  };

  const handleGeneralQuery = async (query: string) => {
    addMessage(
      "agent",
      "Processing your request...",
      { type: "general", status: "thinking" }
    );

    setTimeout(() => {
      addMessage(
        "agent",
        `I understand you said: "${query}". I'm an AI agent capable of making calls, navigating maps, scheduling appointments, and much more. How can I help you specifically?`,
        { type: "general", status: "completed" }
      );
    }, 1500);
  };

  // Helper functions to extract information from commands
  const extractLocation = (command: string): string => {
    const match = command.match(/(?:search|to|for)\s+(.+?)(?:\s+and|$)/i);
    return match ? match[1].trim() : "sadar bazaar chatgali";
  };

  const extractAppointmentDetails = (command: string) => {
    const dateMatch = command.match(/(\d{1,2}(?:st|nd|rd|th)?\s+(?:january|february|march|april|may|june|july|august|september|october|november|december|\d{1,2}))/i);
    const timeMatch = command.match(/(\d{1,2}(?::\d{2})?\s*(?:am|pm))/i);
    const serviceMatch = command.match(/(?:hair\s*salon|haircut|dentist|doctor|massage)/i);

    return {
      service: serviceMatch ? serviceMatch[0] : "hair salon",
      date: dateMatch ? dateMatch[1] : "4th November",
      time: timeMatch ? timeMatch[1] : "2 PM",
      location: "Your preferred salon",
    };
  };

  const extractSearchQuery = (command: string): string => {
    const match = command.match(/(?:search|find)\s+(?:for\s+)?(.+)/i);
    return match ? match[1].trim() : command;
  };

  const extractReminder = (command: string) => {
    const match = command.match(/remind\s+me\s+(?:to\s+)?(.+?)(?:\s+(?:at|on|in)\s+(.+))?$/i);
    return {
      text: match ? match[1].trim() : command,
      time: match && match[2] ? match[2].trim() : "later",
    };
  };

  const extractMessageDetails = (command: string) => {
    const recipientMatch = command.match(/(?:send|text)\s+(?:message\s+)?(?:to\s+)?(\w+)/i);
    const messageMatch = command.match(/(?:saying|that)\s+(.+)/i);

    return {
      recipient: recipientMatch ? recipientMatch[1] : "contact",
      message: messageMatch ? messageMatch[1].trim() : "Hello",
    };
  };

  const extractSong = (command: string): string => {
    const match = command.match(/play\s+(.+)/i);
    return match ? match[1].trim() : "music";
  };

  const toggleListening = () => {
    if (!recognition) {
      addMessage("system", "Speech recognition not supported in this browser.");
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
      addMessage("system", "Listening stopped.");
    } else {
      recognition.start();
      setIsListening(true);
      addMessage("system", "Listening... Say 'Hey Jarvis' followed by your command.");
    }
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      handleVoiceCommand(inputText);
      setInputText("");
    }
  };

  const getActionIcon = (actionType?: string) => {
    switch (actionType) {
      case "call":
        return <Phone className="w-4 h-4" />;
      case "navigation":
        return <MapPin className="w-4 h-4" />;
      case "appointment":
        return <Calendar className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            JARVIS
          </h1>
          <p className="text-gray-400">Your AGI Voice Assistant</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-2xl p-6 mb-6 min-h-[500px] max-h-[600px] overflow-y-auto">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`mb-4 ${
                message.type === "user"
                  ? "text-right"
                  : message.type === "system"
                  ? "text-center"
                  : "text-left"
              }`}
            >
              <div
                className={`inline-block max-w-[80%] p-4 rounded-lg ${
                  message.type === "user"
                    ? "bg-blue-600"
                    : message.type === "system"
                    ? "bg-gray-700 text-gray-300 text-sm"
                    : "bg-gray-700"
                }`}
              >
                {message.action && (
                  <div className="flex items-center gap-2 mb-2 text-blue-300">
                    {getActionIcon(message.action.type)}
                    <span className="text-xs uppercase font-semibold">
                      {message.action.type} - {message.action.status}
                    </span>
                  </div>
                )}
                <p className="text-sm leading-relaxed">{message.content}</p>
                <p className="text-xs text-gray-400 mt-2">
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-2xl p-6">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={toggleListening}
              className={`flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center transition-all ${
                isListening
                  ? "bg-red-600 hover:bg-red-700 animate-pulse"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isListening ? (
                <MicOff className="w-8 h-8" />
              ) : (
                <Mic className="w-8 h-8" />
              )}
            </button>
            <form onSubmit={handleTextSubmit} className="flex-1 flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type your command or click the mic..."
                className="flex-1 bg-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 rounded-lg px-6 py-3 transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
            <button
              onClick={() =>
                handleVoiceCommand("Hey Jarvis, call daddy")
              }
              className="bg-gray-700 hover:bg-gray-600 rounded-lg p-3 transition-colors"
            >
              <Phone className="w-4 h-4 mx-auto mb-1" />
              Call Contact
            </button>
            <button
              onClick={() =>
                handleVoiceCommand(
                  "Hey Jarvis, open google map and search sadar bazaar chatgali"
                )
              }
              className="bg-gray-700 hover:bg-gray-600 rounded-lg p-3 transition-colors"
            >
              <MapPin className="w-4 h-4 mx-auto mb-1" />
              Navigate
            </button>
            <button
              onClick={() =>
                handleVoiceCommand(
                  "Hey Jarvis, make an appointment to my hair salon on 4th november at 2 pm"
                )
              }
              className="bg-gray-700 hover:bg-gray-600 rounded-lg p-3 transition-colors"
            >
              <Calendar className="w-4 h-4 mx-auto mb-1" />
              Schedule
            </button>
            <button
              onClick={() => handleVoiceCommand("Hey Jarvis, what's the weather")}
              className="bg-gray-700 hover:bg-gray-600 rounded-lg p-3 transition-colors"
            >
              ☀️
              <div>Weather</div>
            </button>
          </div>
        </div>

        <div className="mt-6 bg-gray-800/30 backdrop-blur-lg rounded-lg p-4 text-sm text-gray-400">
          <h3 className="font-semibold mb-2 text-white">Try these commands:</h3>
          <ul className="space-y-1">
            <li>• "Hey Jarvis, call daddy"</li>
            <li>• "Hey Jarvis, open Google Maps and search sadar bazaar chatgali"</li>
            <li>• "Hey Jarvis, make an appointment at my hair salon on 4th November at 2 PM"</li>
            <li>• "Hey Jarvis, remind me to buy groceries at 5 PM"</li>
            <li>• "Hey Jarvis, send a message to John saying I'll be late"</li>
            <li>• "Hey Jarvis, what's the weather like today?"</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
