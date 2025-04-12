
import React from 'react';
import { 
  Book, 
  Rocket, 
  Sliders, 
  Share2, 
  Award, 
  Calendar, 
  ShoppingCart, 
  Users 
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter, 
  SidebarHeader, 
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from '@/components/ui/sidebar';
import LiveCallCard from './LiveCallCard';

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="px-3 py-2">
          <h2 className="text-xl font-bold">Content Hub</h2>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Articles">
              <Book className="h-5 w-5" />
              <span>Articles</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Blog Automation">
              <Rocket className="h-5 w-5" />
              <span>Blog Automation</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Customization">
              <Sliders className="h-5 w-5" />
              <span>Customization</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Social Media">
              <Share2 className="h-5 w-5" />
              <span>Social Media</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Lead Magnets">
              <Award className="h-5 w-5" />
              <span>Lead Magnets</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      
      <SidebarFooter className="p-4">
        <LiveCallCard></LiveCallCard>
       
           
      </SidebarFooter>
      
    </Sidebar>
  );
}
