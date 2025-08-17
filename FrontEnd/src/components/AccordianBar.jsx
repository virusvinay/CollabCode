import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";

export default function AccordianBar() {
  const items = [
    {
      question: 'What is CollabCode?',
      answer: 'CollabCode is a real-time collaborative code editor that allows multiple users to edit code simultaneously and see changes in real-time.'
    },
    {
      question: 'How to use it?',
      answer: "Create or join a room using a Room ID. Share the ID with collaborators to join the same session."
    },
    {
      question: 'Invite others?',
      answer: 'Yes — share the Room ID to allow others to join.'
    },
    {
      question: 'Simultaneous editing?',
      answer: 'Yes, multiple users can edit and see changes in real-time.'
    },
    {
      question: 'Supported languages?',
      answer: 'Common languages like JavaScript, Python, Java, C++ and more.'
    }
  ];

  return (
    <div className="w-full">
      <Accordion type="single" collapsible className="space-y-4">
        {items.map((item, idx) => (
          <AccordionItem key={idx} value={`item-${idx + 1}`} className="bg-gray-800 border border-gray-700 rounded-lg">
            <AccordionTrigger className="w-full p-4 text-left text-white">
              <h3 className="text-lg font-semibold">{item.question}</h3>
            </AccordionTrigger>
            <AccordionContent className="p-4 text-gray-300">
              <p>{item.answer}</p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
