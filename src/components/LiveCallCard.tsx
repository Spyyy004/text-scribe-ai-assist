import React from 'react';
import { Card, CardContent } from "@/components/ui/card"; // Assuming shadcn/ui structure
import { Video } from 'lucide-react'; // Changed from Calendar and Users

const LiveCallCard = () => {
  return (
    // Card styling: Softer gradient, larger rounding, added overflow-hidden for pattern containment
    <Card className="relative rounded-xl overflow-hidden bg-gradient-to-br from-indigo-50 via-purple-50 to-purple-100 border border-purple-100 shadow-sm w-full max-w-sm">

      {/* Background Dot Pattern - Absolutely Positioned */}
      <div className="absolute inset-x-0 top-0 h-16 overflow-hidden pointer-events-none">
        <div className="absolute -top-4 -left-4 w-[calc(100%+2rem)] h-20 flex flex-wrap gap-2 opacity-40">
          {/* Generate dots programmatically */}
          {Array.from({ length: 100 }).map((_, i) => (
            <div key={i} className="w-2 h-2 bg-purple-300 rounded-sm opacity-50"></div>
          ))}
        </div>
      </div>

      {/* Card Content - Increased Padding, adjusted spacing */}
      <CardContent className="p-6 space-y-3 relative z-10"> {/* Ensure content is above pattern */}
        {/* Icon */}
        <div className="mb-3"> {/* Added margin-bottom for spacing */}
          <Video className="h-8 w-8 text-purple-600" fill="currentColor" /> {/* Larger, filled icon */}
        </div>

        {/* Heading */}
        <h3 className="text-lg font-semibold text-gray-900">Join Our Weekly Live Call</h3>

        {/* Subheading */}
        <p className="text-purple-700 font-medium text-sm">Every Wednesday at 11 AM EST.</p>

        {/* Button */}
        <button className="w-full bg-white text-gray-800 font-medium py-2.5 px-4 rounded-lg border border-gray-200 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 transition-colors">
          Add to Calendar
        </button>

        {/* Removed the "Purchase Backlinks" and "Affiliate Program" section as it's not part of the target card design */}

      </CardContent>
    </Card>
  );
};

export default LiveCallCard;

// --- Note: You might need to import the Card components if not already done ---
// Example assuming shadcn/ui:
// import { Card, CardContent } from "@/components/ui/card";
// Make sure lucide-react is installed: npm install lucide-react