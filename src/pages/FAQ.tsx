import { BottomNav } from "@/components/BottomNav";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useState } from "react";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const FAQ = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const faqItems: FAQItem[] = [
    {
      id: "1",
      question: "Sagittis donec amet",
      answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sagittis donec amet ultricies nunc.",
    },
    {
      id: "2",
      question: "Lorem ipsum dolor sit",
      answer: "Sagittis donec amet ultricies nunc. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    },
    {
      id: "3",
      question: "Quisque faucibus ex",
      answer: "Quisque faucibus ex sapien, vel pellentesque est placerat at ultricies nunc.",
    },
    {
      id: "4",
      question: "Pulvinar vivamus fringilla",
      answer: "Pulvinar vivamus fringilla lacus nec pellentesque. Est placerat at ultricies nunc.",
    },
  ];

  const filteredItems = faqItems.filter(item =>
    item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen bg-background pb-20">
      <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-6 rounded-b-3xl shadow-lg">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-4 text-center">FAQ</h1>
          <p className="text-primary-foreground/90 mb-4">Descreva seu problema</p>
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Digite aqui..."
            className="bg-background text-foreground"
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full p-4">
        <h2 className="text-lg font-bold mb-4 text-center text-foreground bg-background border-y border-border py-3">
          Tópicos principais
        </h2>

        <Accordion type="single" collapsible className="w-full">
          {filteredItems.map((item) => (
            <AccordionItem key={item.id} value={item.id}>
              <AccordionTrigger className="text-left">
                {item.question}
              </AccordionTrigger>
              <AccordionContent>
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {filteredItems.length === 0 && (
          <p className="text-center text-muted-foreground py-8">
            Nenhum resultado encontrado
          </p>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default FAQ;
