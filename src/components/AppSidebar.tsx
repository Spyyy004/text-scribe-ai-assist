
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
        <Card className="bg-gradient-to-br from-purple-100 to-purple-50 border-purple-200">
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center gap-2">
              <div className="bg-purple-600 rounded p-1">
                <Calendar className="h-4 w-4 text-white" />
              </div>
              <h3 className="font-semibold text-gray-800">Join Our Weekly Live Call</h3>
            </div>
            
            <p className="text-purple-600 text-sm">Every Wednesday at 11 AM EST.</p>
            
            <button className="w-full bg-white text-gray-700 font-medium py-2 rounded-md border border-gray-200 hover:bg-gray-50 transition-colors">
              Add to Calendar
            </button>
            
            <div className="pt-2 border-t border-purple-100 space-y-2">
              <a href="#" className="flex items-center text-gray-600 text-sm hover:text-gray-800">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Purchase Backlinks
              </a>
              <div className="flex items-center justify-between">
                <a href="#" className="flex items-center text-gray-600 text-sm hover:text-gray-800">
                  <Users className="h-4 w-4 mr-2" />
                  Affiliate Program
                </a>
                <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded-full">
                  Earn 30%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </SidebarFooter>
    </Sidebar>
  );
}
