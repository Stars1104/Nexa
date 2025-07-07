import { ArrowRight } from "lucide-react";
import { Button } from "../ui/button";

export const CTA = () => {
  return (
    <section className="py-12 md:py-20 bg-gradient-to-r from-pink-500 to-purple-600">
      <div className="max-w-4xl mx-auto px-4 md:px-6 text-center text-white">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
          Pronto para transformar seu conteúdo em uma carreira?
        </h2>
        <p className="text-lg md:text-xl mb-6 md:mb-8 opacity-90">
          Junte-se a centenas de criadores que já estão monetizando seu potencial com o NEXA UGC
        </p>
        <Button size="lg" className="bg-white text-pink-600 hover:bg-gray-100 px-8 w-full sm:w-auto">
          Começar minha jornada
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </section>
  );
};
