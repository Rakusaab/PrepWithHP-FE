"use client";

import { ContentUpload } from '@/components/content/content-upload';
import { Sidebar } from '@/components/dashboard/sidebar';
import React from 'react';

export default function ContentUploadPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <div className="h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <Sidebar 
        collapsed={sidebarCollapsed}
        onCollapsedChange={setSidebarCollapsed}
        mobileMenuOpen={mobileMenuOpen}
        onMobileMenuChange={setMobileMenuOpen}
      />

      {/* Main Content */}
      <div className={`
        transition-all duration-300 ease-in-out h-full overflow-auto
        ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'}
        ml-0
      `}>
        <ContentUpload />
      </div>
    </div>
  );
}
