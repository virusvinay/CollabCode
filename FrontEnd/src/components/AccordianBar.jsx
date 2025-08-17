
  import React from 'react'
  import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "../components/ui/accordion"
  export default function AccordianBar() {

    const items = [
        {
          question: 'What is CodeCollabify?',
          answer: 'CodeCollabify is a real-time collaborative code editor that allows multiple users to edit code simultaneously and see changes in real-time.'
        },
        {
          question: 'How to use it?',
          answer: "To use CodeCollabify, If you don't already have a room, start by creating one. This will generate a unique Room ID for your session.Share the Room ID with your collaborators. They can use this ID to join the session and start collaborating in real-time."
        },
        {
            question: 'Can I invite others to join my session?',
            answer: 'Yes, you can invite others to join your coding session by sharing a unique roomID generated when you start a new session. Collaborators can join using this ID.'
          },
        {
          question: 'Can multiple people simultaneously edit the code?',
          answer: 'Yes, CodeCollabify supports simultaneous code editing by multiple users. All participants will see updates in real-time as changes are made.'
        },
        
        {
          question: 'What programming languages are supported?',
          answer: 'CodeCollabify supports a wide range of programming languages including JavaScript, Python, Java, C++, and more. We continuously add support for new languages based on user feedback.'
        }
      ];
    return (
        <div className="w-full max-w-2xl mx-auto py-8 px-4">
        <Accordion type="single" collapsible className="space-y-4">
          {items.map((item, index) => (
            <AccordionItem key={index} value={`item-${index + 1}`}>
              <AccordionTrigger className="w-full p-4 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-300">
                <h3 className="text-lg font-semibold">{item.question}</h3>
              </AccordionTrigger>
              <AccordionContent className="p-4 bg-blue-100 text-blue-800 rounded-b-lg">
                <p>{item.answer}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    )
  }
  
  