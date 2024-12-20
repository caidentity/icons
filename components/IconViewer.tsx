'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Search, Download, Eye, X, Link, Check } from 'lucide-react';
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Alert } from "./ui/alert";
import { IconMetadata, IconCategory } from '@/types/icon';
import { loadIconMetadata, loadSvgContent } from '@/lib/iconLoader';

const IconViewer = () => {
  const [categories, setCategories] = useState<IconCategory[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSize, setSelectedSize] = useState(24);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedIcon, setSelectedIcon] = useState<IconMetadata | null>(null);
  const [copyAlert, setCopyAlert] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    loadIconMetadata()
      .then(setCategories)
      .finally(() => setIsLoading(false));
  }, []);

  const allIcons = useMemo(() => {
    return categories.flatMap(category => category.icons);
  }, [categories]);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    allIcons.forEach(icon => {
      icon.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags);
  }, [allIcons]);

  const filteredIcons = useMemo(() => {
    return allIcons.filter(icon => {
      const matchesSearch = icon.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSize = icon.size === selectedSize;
      const matchesCategory = !selectedCategory || icon.category === selectedCategory;
      const matchesTags = selectedTags.length === 0 || 
        selectedTags.every(tag => icon.tags.includes(tag));
      
      return matchesSearch && matchesSize && matchesCategory && matchesTags;
    });
  }, [allIcons, searchQuery, selectedSize, selectedCategory, selectedTags]);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleDownload = async (icon: IconMetadata) => {
    try {
      const svgContent = await loadSvgContent(icon.path);
      if (svgContent) {
        const blob = new Blob([Buffer.from(svgContent, 'utf-8')], { type: 'image/svg+xml' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${icon.name}-${icon.size}.svg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error downloading icon:', error);
    }
  };

  const handleCopy = async (iconName: string) => {
    try {
      await navigator.clipboard.writeText(iconName);
      setCopyAlert(`Copied "${iconName}" to clipboard`);
      setTimeout(() => setCopyAlert(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
      setCopyAlert('Failed to copy to clipboard');
      setTimeout(() => setCopyAlert(null), 2000);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto relative">
      {copyAlert && (
        <div className="fixed top-4 right-4 z-50">
          <Alert className="bg-green-50 border-green-200 text-green-800">
            <Check className="h-4 w-4 mr-2" />
            {copyAlert}
          </Alert>
        </div>
      )}

      <div className="mb-4">
        <select
          className="w-full p-2 border rounded"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map(category => (
            <option key={category.name} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className={`transition-all duration-300 ${selectedIcon ? 'pr-96' : ''}`}>
        <div className="mb-6 space-y-4">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search icons..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          
          <div className="flex gap-2">
            <Button
              variant={selectedSize === 24 ? "default" : "outline"}
              onClick={() => setSelectedSize(24)}
              className="w-20"
            >
              24px
            </Button>
            <Button
              variant={selectedSize === 16 ? "default" : "outline"}
              onClick={() => setSelectedSize(16)}
              className="w-20"
            >
              16px
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {allTags.map(tag => (
              <Badge
                key={tag}
                variant={selectedTags.includes(tag) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => toggleTag(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-gray-500">
            Loading icons...
          </div>
        ) : filteredIcons.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No icons found matching your criteria
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
            {filteredIcons.map((icon, index) => (
              <div
                key={`${icon.name}-${icon.size}-${index}`}
                className="p-4 border rounded-lg hover:border-blue-500 transition-colors group relative"
              >
                <div className="flex flex-col items-center gap-2">
                  <img
                    src={icon.path}
                    alt={icon.name}
                    className="w-8 h-8"
                    onError={() => setLoadError(`Failed to load icon: ${icon.name}`)}
                  />
                  <span className="text-sm text-center text-gray-600">{icon.name}</span>
                </div>
                
                <div className="absolute inset-0 bg-white/90 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDownload(icon)}
                    className="w-10 h-10 p-0"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedIcon(icon)}
                    className="w-10 h-10 p-0"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleCopy(icon.name)}
                    className="w-10 h-10 p-0"
                  >
                    <Link className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div
        className={`fixed top-0 right-0 h-full w-96 bg-white border-l shadow-lg transform transition-transform duration-300 ease-in-out overflow-y-auto ${
          selectedIcon ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {selectedIcon && (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">{selectedIcon.name}</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedIcon(null)}
                className="w-8 h-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-6">
              <div className="flex justify-center items-center h-48 border rounded-lg">
                <img
                  src={selectedIcon.path}
                  alt={selectedIcon.name}
                  className="w-24 h-24"
                />
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Size</h3>
                  <p>{selectedIcon.size}px</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Tags</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedIcon.tags.map(tag => (
                      <Badge key={tag} variant="secondary">{tag}</Badge>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => handleDownload(selectedIcon)}
                    className="flex-1"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download SVG
                  </Button>
                  <Button
                    onClick={() => handleCopy(selectedIcon.name)}
                    variant="outline"
                    className="flex-1"
                  >
                    <Link className="h-4 w-4 mr-2" />
                    Copy Name
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {loadError && (
        <div className="fixed top-4 right-4 z-50">
          <Alert className="bg-red-50 border-red-200 text-red-800">
            {loadError}
          </Alert>
        </div>
      )}
    </div>
  );
};

export default IconViewer; 