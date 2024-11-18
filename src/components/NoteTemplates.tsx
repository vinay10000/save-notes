'use client';

import React from 'react';
import { FileText, List as ListIcon, Calendar, Book } from 'lucide-react';

interface Template {
  id: string;
  name: string;
  icon: React.ElementType;
  content: string;
}

const templates: Template[] = [
  {
    id: 'blank',
    name: 'Blank Note',
    icon: FileText,
    content: '',
  },
  {
    id: 'todo',
    name: 'To-Do List',
    icon: ListIcon,
    content: '# To-Do List\n\n- [ ] Task 1\n- [ ] Task 2\n- [ ] Task 3',
  },
  {
    id: 'meeting',
    name: 'Meeting Notes',
    icon: Calendar,
    content: `# Meeting Notes

Date: ${new Date().toLocaleDateString()}
Attendees:

## Agenda
1.
2.
3.

## Discussion Points

## Action Items
- [ ]
- [ ]

## Next Steps`,
  },
  {
    id: 'journal',
    name: 'Journal Entry',
    icon: Book,
    content: `# Journal Entry - ${new Date().toLocaleDateString()}

## Today's Highlights

## Thoughts & Reflections

## Goals for Tomorrow
- [ ]
- [ ]`,
  },
];

interface NoteTemplatesProps {
  onSelectTemplate: (template: Template) => void;
}

export function NoteTemplates({ onSelectTemplate }: NoteTemplatesProps) {
  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      {templates.map((template) => (
        <button
          key={template.id}
          onClick={() => onSelectTemplate(template)}
          className="flex items-center gap-2 p-3 text-left border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          <template.icon className="w-5 h-5" />
          <span>{template.name}</span>
        </button>
      ))}
    </div>
  );
}

export { templates };
