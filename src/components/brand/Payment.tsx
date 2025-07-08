import React, { useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { AlertCircle, CheckCircle2, CreditCard, PlusCircle, Edit2, Trash2 } from "lucide-react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogDescription } from "../ui/dialog";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel } from "../ui/alert-dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";

const initialPaymentMethods = [
  {
    id: 1,
    type: "Cartão de Crédito",
    last4: "4242",
    expires: "12/24",
    isDefault: true,
  },
];

const transactions = [
  {
    title: "Lançamento Verão 2024",
    date: "15/11/2023",
    amount: "- R$ 2000,00",
    status: "Concluído",
    type: "out",
  },
  {
    title: "Review Produto XYZ",
    date: "10/11/2023",
    amount: "+ R$ 500,00",
    status: "Concluído",
    type: "in",
  },
];

export default function Payment() {
  const [paymentMethods, setPaymentMethods] = useState(initialPaymentMethods);
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [removeOpen, setRemoveOpen] = useState(false);
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [removeIdx, setRemoveIdx] = useState<number | null>(null);
  const [form, setForm] = useState({
    type: "Cartão de Crédito",
    cardNumber: "",
    last4: "",
    expires: "",
    isDefault: false,
  });

  // Handlers
  const handleAdd = () => {
    setForm({ type: "Cartão de Crédito", cardNumber: "", last4: "", expires: "", isDefault: paymentMethods.length === 0 });
    setAddOpen(true);
  };
  const handleEdit = (idx: number) => {
    setEditIdx(idx);
    setForm({
      type: paymentMethods[idx].type,
      cardNumber: "",
      last4: paymentMethods[idx].last4,
      expires: paymentMethods[idx].expires,
      isDefault: paymentMethods[idx].isDefault,
    });
    setEditOpen(true);
  };
  const handleRemove = (idx: number) => {
    setRemoveIdx(idx);
    setRemoveOpen(true);
  };
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let newMethods = paymentMethods.map((m) => ({ ...m, isDefault: form.isDefault ? false : m.isDefault }));
    const newMethod = {
      ...form,
      id: Date.now(),
      last4: form.cardNumber.slice(-4),
      isDefault: form.isDefault || newMethods.length === 0,
    };
    // Remove cardNumber from storage
    delete newMethod.cardNumber;
    if (newMethod.isDefault) {
      newMethods = newMethods.map((m) => ({ ...m, isDefault: false }));
    }
    setPaymentMethods([...newMethods, newMethod]);
    setAddOpen(false);
  };
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editIdx === null) return;
    let newMethods = paymentMethods.map((m, i) =>
      i === editIdx
        ? { ...m, expires: form.expires, isDefault: form.isDefault }
        : { ...m, isDefault: form.isDefault ? false : m.isDefault }
    );
    if (form.isDefault) {
      newMethods = newMethods.map((m, i) => ({ ...m, isDefault: i === editIdx }));
    }
    setPaymentMethods(newMethods);
    setEditOpen(false);
    setEditIdx(null);
  };
  const handleRemoveConfirm = () => {
    if (removeIdx === null) return;
    let newMethods = paymentMethods.filter((_, i) => i !== removeIdx);
    // If default was removed, set first as default
    if (!newMethods.some((m) => m.isDefault) && newMethods.length > 0) {
      newMethods[0].isDefault = true;
    }
    setPaymentMethods(newMethods);
    setRemoveOpen(false);
    setRemoveIdx(null);
  };
  // Prevent removing only/default method
  const canRemove = (idx: number) => paymentMethods.length > 1 && !paymentMethods[idx].isDefault;

  return (
    <div className="min-h-[92vh] dark:bg-[#171717] flex flex-col items-center py-4 px-2 sm:px-10">
      <div className="w-full">
        <h1 className="text-2xl md:text-3xl font-bold mb-1">Pagamentos</h1>
        <p className="text-muted-foreground mb-8 text-sm md:text-base">
          Gerencie seus métodos de pagamento e visualize transações
        </p>
        {/* Métodos de Pagamento */}
        <Card className="mb-8">
          <CardContent className="p-6 md:p-8">
            <h2 className="text-base md:text-lg font-semibold mb-4">Métodos de Pagamento</h2>
            <div className="flex flex-col gap-4">
              {/* Payment Method Card */}
              {paymentMethods.map((method, idx) => (
                <div
                  key={method.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0 border rounded-lg px-4 py-3 bg-background border-muted"
                >
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-7 h-7 text-pink-500" />
                    <div className="flex flex-col text-sm">
                      <span className="font-medium">
                        {method.type} <span className="tracking-widest ml-1">•••• {method.last4}</span>
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Expira em {method.expires}
                        {method.isDefault && (
                          <span className="ml-2 text-pink-500 font-medium">(Padrão)</span>
                        )}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2 sm:mt-0">
                    <Button variant="link" className="text-pink-500 px-0 h-auto text-sm font-medium" onClick={() => handleEdit(idx)}>
                      Editar
                    </Button>
                    <Button variant="link" className="text-red-500 px-0 h-auto text-sm font-medium" disabled={!canRemove(idx)} onClick={() => handleRemove(idx)}>
                      Remover
                    </Button>
                  </div>
                </div>
              ))}
              {/* Add New Payment Method */}
              <div className="flex items-center justify-center border-2 border-dashed border-muted rounded-lg py-6 cursor-pointer hover:bg-muted/40 transition" onClick={handleAdd}>
                <PlusCircle className="w-6 h-6 text-muted-foreground mr-2" />
                <div className="flex flex-col items-center">
                  <span className="text-sm font-medium">Adicionar novo método de pagamento</span>
                  <span className="text-xs text-muted-foreground">Cartão de crédito, débito ou PIX</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        {/* Histórico de Transações */}
        <Card>
          <CardContent className="p-6 md:p-8">
            <h2 className="text-base md:text-lg font-semibold mb-4">Histórico de Transações</h2>
            <div className="flex flex-col gap-3">
              {transactions.map((tx, idx) => (
                <div
                  key={idx}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0 border rounded-lg px-4 py-3 bg-background border-muted"
                >
                  <div className="flex items-center gap-3">
                    {tx.type === "out" ? (
                      <AlertCircle className="w-6 h-6 text-red-400" />
                    ) : (
                      <CheckCircle2 className="w-6 h-6 text-green-500" />
                    )}
                    <div className="flex flex-col text-sm">
                      <span className="font-medium">{tx.title}</span>
                      <span className="text-xs text-muted-foreground">{tx.date}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 mt-2 sm:mt-0">
                    <span className={`font-medium ${tx.type === "out" ? "text-red-500" : "text-green-600"}`}>{tx.amount}</span>
                    <span className="text-xs text-green-500">{tx.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <form onSubmit={handleAddSubmit} className="space-y-4">
            <DialogHeader>
              <DialogTitle>Adicionar Método de Pagamento</DialogTitle>
              <DialogDescription>Preencha os dados do cartão.</DialogDescription>
            </DialogHeader>
            <div>
              <Label htmlFor="cardNumber">Número do Cartão</Label>
              <Input id="cardNumber" name="cardNumber" type="text" inputMode="numeric" pattern="[0-9]{16}" maxLength={16} minLength={16} required placeholder="1234 5678 9012 3456" value={form.cardNumber} onChange={handleFormChange} />
            </div>
            <div>
              <Label htmlFor="last4">Últimos 4 dígitos</Label>
              <Input id="last4" name="last4" maxLength={4} minLength={4} required placeholder="4242" value={form.cardNumber.slice(-4)} readOnly />
            </div>
            <div>
              <Label htmlFor="expires">Validade</Label>
              <Input id="expires" name="expires" required placeholder="MM/AA" value={form.expires} onChange={handleFormChange} pattern="(0[1-9]|1[0-2])\/([0-9]{2})" />
            </div>
            <div className="flex items-center gap-2">
              <Switch id="isDefault" name="isDefault" checked={form.isDefault} onCheckedChange={(checked) => setForm((prev) => ({ ...prev, isDefault: checked }))} />
              <Label htmlFor="isDefault">Definir como padrão</Label>
            </div>
            <DialogFooter>
              <Button type="submit">Adicionar</Button>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancelar</Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <DialogHeader>
              <DialogTitle>Editar Método de Pagamento</DialogTitle>
              <DialogDescription>Altere os dados do cartão.</DialogDescription>
            </DialogHeader>
            <div>
              <Label>Últimos 4 dígitos</Label>
              <Input value={form.last4} readOnly className="bg-muted/40 cursor-not-allowed" />
            </div>
            <div>
              <Label htmlFor="expires">Validade</Label>
              <Input id="expires" name="expires" required placeholder="MM/AA" value={form.expires} onChange={handleFormChange} pattern="(0[1-9]|1[0-2])\/([0-9]{2})" />
            </div>
            <div className="flex items-center gap-2">
              <Switch id="isDefault" name="isDefault" checked={form.isDefault} onCheckedChange={(checked) => setForm((prev) => ({ ...prev, isDefault: checked }))} />
              <Label htmlFor="isDefault">Definir como padrão</Label>
            </div>
            <DialogFooter>
              <Button type="submit">Salvar</Button>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancelar</Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      {/* Remove Dialog */}
      <AlertDialog open={removeOpen} onOpenChange={setRemoveOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover método de pagamento?</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover este método de pagamento? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleRemoveConfirm} className="bg-red-500 hover:bg-red-600">Remover</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
