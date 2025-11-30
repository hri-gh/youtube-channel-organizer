'use client'

import { useState, useMemo } from 'react'
import { ChannelCard, Channel } from '@/components/data-display/ChannelCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, Plus, Grid3X3, List, Heart, ExternalLink, Edit, Trash2 } from 'lucide-react'

interface ChannelListProps {
  channels: Channel[]
  selectedTag: string | null
  onAddChannel: () => void
  onEditChannel: (channel: Channel) => void
  onDeleteChannel: (channel: Channel) => void
}

export function ChannelList({ 
  channels, 
  selectedTag, 
  onAddChannel, 
  onEditChannel,
  onDeleteChannel
}: ChannelListProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card')
  
  const filteredChannels = useMemo(() => {
    let filtered = channels
    
    // Filter by selected tag
    if (selectedTag) {
      filtered = filtered.filter(channel => 
        channel.tags.includes(selectedTag)
      )
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(channel =>
        channel.name?.toLowerCase().includes(query) ||
        channel.tags.some(tag => tag.toLowerCase().includes(query)) ||
        channel.note?.toLowerCase().includes(query)
      )
    }
    
    return filtered
  }, [channels, selectedTag, searchQuery])
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">
            {selectedTag ? `${selectedTag} Channels` : 'All Channels'}
          </h1>
          <p className="text-muted-foreground">
            {filteredChannels.length} channel{filteredChannels.length !== 1 ? 's' : ''}
          </p>
        </div>
        
        <Button onClick={onAddChannel} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Channel
        </Button>
      </div>
      
      {/* Search and View Toggle */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search channels by name, tag, or note..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex border rounded-md">
          <Button
            variant={viewMode === 'card' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('card')}
            className="rounded-r-none"
          >
            <Grid3X3 className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('list')}
            className="rounded-l-none"
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      {/* Channel Display */}
      {viewMode === 'card' ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredChannels.map((channel) => (
            <ChannelCard
              key={channel.id}
              channel={channel}
              onEdit={onEditChannel}
              onDelete={onDeleteChannel}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredChannels.map((channel) => (
            <div
              key={channel.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium truncate">
                    {channel.name || 'Unnamed Channel'}
                  </h3>
                  {channel.favourite && (
                    <Heart className="w-4 h-4 fill-red-500 text-red-500 flex-shrink-0" />
                  )}
                </div>
                
                <div className="flex flex-wrap gap-1 mb-1">
                  {channel.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                {channel.note && (
                  <p className="text-sm text-muted-foreground truncate">
                    {channel.note}
                  </p>
                )}
              </div>
              
              <div className="flex gap-2 ml-4">
                <Button
                  size="icon-sm"
                  variant="ghost"
                  onClick={() => onEditChannel(channel)}
                  title="Edit channel"
                >
                  <Edit className="w-4 h-4" />
                </Button>
                
                <Button
                  size="icon-sm"
                  variant="ghost"
                  onClick={() => onDeleteChannel(channel)}
                  className="text-destructive hover:text-destructive"
                  title="Delete channel"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
                
                <Button
                  size="icon-sm"
                  variant="ghost"
                  asChild
                  title="Open channel"
                >
                  <a
                    href={channel.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {filteredChannels.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {searchQuery || selectedTag 
              ? 'No channels found matching your criteria.' 
              : 'No channels yet. Add your first channel to get started!'
            }
          </p>
        </div>
      )}
    </div>
  )
}