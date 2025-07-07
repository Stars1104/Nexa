import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "../ui/dialog";

interface ApplyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campaignName: string;
  brandName: string;
  onConfirm: () => void;
  loading?: boolean;
}

const ApplyModal: React.FC<ApplyModalProps> = ({
  open,
  onOpenChange,
  campaignName,
  brandName,
  onConfirm,
  loading,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] sm:max-w-lg p-4 sm:p-6 rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl sm:text-2xl font-bold mb-2 text-gray-900 dark:text-white">
            Confirmar aplicação
          </DialogTitle>
        </DialogHeader>
        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-200 mb-4">
          Tem certeza que quer aplicar para a campanha <span className="font-bold text-gray-800 dark:text-white">{campaignName}</span> da marca <span className="font-bold text-gray-800 dark:text-white">{brandName}</span>?
        </p>
        <div className="bg-blue-50 dark:bg-gray-800 rounded-xl p-4 mb-6">
          <span className="text-base sm:text-base text-blue-700 dark:text-gray-100 font-medium">
            Ao aplicar, a marca receberá sua solicitação e poderá entrar em contato para mais detalhes.
          </span>
        </div>
        <DialogFooter className="gap-2 mt-2 flex-col-reverse sm:flex-row">
          <DialogClose asChild>
            <button
              type="button"
              className="w-full sm:w-auto border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg px-6 py-2 font-medium bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              disabled={loading}
            >
              Cancelar
            </button>
          </DialogClose>
          <button
            type="button"
            className="w-full sm:w-auto bg-pink-600 hover:bg-pink-700 text-white rounded-lg px-6 py-2 font-medium transition disabled:opacity-60"
            onClick={onConfirm}
            disabled={loading}
          >
            Confirmar aplicação
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ApplyModal;
