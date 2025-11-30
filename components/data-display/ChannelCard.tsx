import { Card } from '@/components/core/Card'
import { Badge } from '@/components/ui/badge'
import { Heart, ExternalLink, Edit, Trash2 } from 'lucide-react'

export interface Channel {
  id: string
  link: string
  name?: string
  tags: string[]
  note?: string
  favourite?: boolean
}

interface ChannelCardProps {
  channel: Channel
  onEdit: (channel: Channel) => void
  onDelete: (channel: Channel) => void
}

export function ChannelCard({ channel, onEdit, onDelete }: ChannelCardProps) {
  const displayName = channel.name || 'Unnamed Channel'
  
  return (
    <Card className="relative">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold text-lg">{displayName}</h3>
            {channel.favourite && (
              <Heart className="w-4 h-4 fill-red-500 text-red-500" />
            )}
          </div>
          
          <div className="flex flex-wrap gap-1 mb-3">
            {channel.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
          
          {channel.note && (
            <p className="text-sm text-muted-foreground mb-3">
              {channel.note}
            </p>
          )}
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(channel)}
            className="p-2 hover:bg-muted rounded-md transition-colors"
            title="Edit channel"
          >
            <Edit className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => onDelete(channel)}
            className="p-2 hover:bg-destructive/10 text-destructive rounded-md transition-colors"
            title="Delete channel"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          
          <a
            href={channel.link}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 hover:bg-muted rounded-md transition-colors"
            title="Open channel"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </Card>
  )
}