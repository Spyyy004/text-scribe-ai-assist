import React, { useState } from 'react';
import {
  Newspaper,      // Articles
  Bot,            // Blog Automation
  Layers,         // Customization
  Share2,         // Social Media
  Magnet,         // Lead Magnets
  LineChart,      // AI SEO Rank Tracker
  ChevronDown,    // Collapsed state
  ChevronUp,      // Expanded state
  Video,          // Live Call Card icon (assuming used inside)
  ShoppingCart,   // Purchase Backlinks
  Percent,        // Affiliate Program (or Tag)
  // Calendar,    // No longer needed directly here
  // Award,       // No longer needed directly here
  // Sliders,     // No longer needed directly here
  // Rocket,      // No longer needed directly here
  // Book,        // No longer needed directly here
  // Users        // No longer needed directly here
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card'; // Keep if LiveCallCard uses it
import LiveCallCard from './LiveCallCard'; // Import the card component
import { cn } from '@/lib/utils'; // For conditional classes
import { Badge } from '@/components/ui/badge'; // Assuming shadcn/ui Badge
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"; // Assuming shadcn/ui Collapsible

// Interface might not be needed if no props
// interface AppSidebarProps {}

export function AppSidebar() {
  // State for active main item and sub-item
  const [activeSubItem, setActiveSubItem] = useState('All Articles'); // Default active sub-item

  // State for collapsible sections
  const [isArticlesOpen, setIsArticlesOpen] = useState(true); // Default open
  const [isAutomationOpen, setIsAutomationOpen] = useState(false);
  const [isCustomizationOpen, setIsCustomizationOpen] = useState(false);

  // Helper component for main navigation items
  const NavItem = ({ icon: Icon, label, children, isOpen, onToggle, hasBadge, badgeText, isActive }) => (
    <div>
      <Collapsible open={isOpen} onOpenChange={onToggle}>
        <CollapsibleTrigger asChild>
          <button className={cn(
            "flex items-center justify-between w-full px-3 py-2.5 rounded-md text-sm font-medium",
            "hover:bg-gray-200 text-gray-700 hover:text-gray-900", // General hover
            // Consider adding active state for the main trigger if needed
          )}>
            <div className="flex items-center gap-3">
              <Icon className="h-5 w-5 text-gray-500" />
              <span>{label}</span>
              {hasBadge && (
                <Badge variant="default" className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-0.5 text-xs">
                  {badgeText || 'New'}
                </Badge>
              )}
            </div>
            {onToggle && (isOpen ? <ChevronUp className="h-4 w-4 text-gray-500" /> : <ChevronDown className="h-4 w-4 text-gray-500" />)}
          </button>
        </CollapsibleTrigger>
        {children && <CollapsibleContent className="pl-5 pt-1">{children}</CollapsibleContent>}
      </Collapsible>
    </div>
  );

  // Helper component for sub-navigation items
  const SubNavItem = ({ label, isActive, onClick }) => (
    <button
      onClick={onClick}
      className={cn(
        "relative flex items-center w-full pl-[26px] py-1.5 rounded-md text-sm", // Adjusted padding for icon space + indent
        "text-gray-600 hover:bg-gray-200 hover:text-gray-900",
        isActive && "bg-indigo-50 text-indigo-700 font-medium" // Active state styles
      )}
    >
      {/* Active indicator line */}
      {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 h-full bg-indigo-600 rounded-r-full"></div>}
      {label}
    </button>
  );

    // Helper for simple nav items without collapse/submenu
  const SimpleNavItem = ({ icon: Icon, label, hasBadge, badgeText }) => (
     <button className={cn(
        "flex items-center justify-between w-full px-3 py-2.5 rounded-md text-sm font-medium",
        "hover:bg-gray-200 text-gray-700 hover:text-gray-900",
      )}>
        <div className="flex items-center gap-3">
          <Icon className="h-5 w-5 text-gray-500" />
          <span>{label}</span>
        </div>
        {hasBadge && (
          <Badge variant="default" className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-0.5 text-xs">
             {badgeText || 'New'}
          </Badge>
        )}
     </button>
  );

  return (
    // Main sidebar container
    <div className="w-64 border-r bg-gray-50 flex flex-col h-full"> {/* Adjusted width and bg */}

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5"> {/* Adjusted padding/spacing */}

        {/* Articles Section (Collapsible) */}
        <NavItem
          icon={Newspaper}
          label="Articles"
          isOpen={isArticlesOpen}
          onToggle={() => setIsArticlesOpen(!isArticlesOpen)}
        >
            {/* Sub Items */}
            <div className="space-y-1 border-l border-gray-200 ml-[9px] pl-3"> {/* Indentation line and spacing */}
                 <SubNavItem
                    label="Generate Articles"
                    isActive={activeSubItem === 'Generate Articles'}
                    onClick={() => setActiveSubItem('Generate Articles')}
                 />
                 <SubNavItem
                    label="All Articles"
                    isActive={activeSubItem === 'All Articles'}
                    onClick={() => setActiveSubItem('All Articles')}
                 />
                  <SubNavItem
                    label="AI SEO Editor"
                    isActive={activeSubItem === 'AI SEO Editor'}
                    onClick={() => setActiveSubItem('AI SEO Editor')}
                 />
            </div>
        </NavItem>

        {/* Blog Automation (Collapsible) */}
        <NavItem
          icon={Bot}
          label="Blog Automation"
          isOpen={isAutomationOpen}
          onToggle={() => setIsAutomationOpen(!isAutomationOpen)}
        />
         {/* Add CollapsibleContent here if/when it has sub-items */}


        {/* Customization (Collapsible) */}
        <NavItem
          icon={Layers}
          label="Customization"
          isOpen={isCustomizationOpen}
          onToggle={() => setIsCustomizationOpen(!isCustomizationOpen)}
        />
         {/* Add CollapsibleContent here if/when it has sub-items */}

        {/* Social Media (Simple) */}
        <SimpleNavItem icon={Share2} label="Social Media" />

        {/* Lead Magnets (Simple) */}
        <SimpleNavItem icon={Magnet} label="Lead Magnets" />

        {/* AI SEO Rank Tracker (Simple with Badge) */}
        <SimpleNavItem icon={LineChart} label="AI SEO Rank Tracker" hasBadge={true} />

      </div>

      {/* Footer Area */}
      <div className="px-4 py-4 border-t bg-gray-50 mt-auto space-y-4"> {/* Keep bg consistent */}
         {/* Live Call Card */}
        <LiveCallCard />

        {/* Footer Links */}
        <div className="space-y-2 pt-2">
           <a href="#" className="flex items-center text-gray-600 hover:text-gray-800 text-sm font-medium gap-2.5 px-1 py-1">
             <ShoppingCart className="h-5 w-5 text-gray-500" />
             Purchase Backlinks
           </a>
           <div className="flex items-center justify-between px-1 py-1">
               <a href="#" className="flex items-center text-gray-600 hover:text-gray-800 text-sm font-medium gap-2.5">
                 <Percent className="h-5 w-5 text-gray-500" /> {/* Or Tag icon */}
                 Affiliate Program
               </a>
               <Badge variant="secondary" className="bg-indigo-100 text-indigo-700 text-xs px-2 py-0.5 font-semibold border border-indigo-200">
                 Earn 30%
               </Badge>
           </div>
        </div>
      </div>
    </div>
  );
}