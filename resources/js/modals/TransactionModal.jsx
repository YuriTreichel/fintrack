import React, { useState } from 'react';
import { Plus, ChevronDown } from 'lucide-react';
import { cn } from '../utils/classNames';
import CustomDatePicker from '../components/ui/CustomDatePicker';
import CustomSelect from '../components/ui/CustomSelect';

export default function TransactionModal({
  onClose,
  onSuccess,
  accounts,
  categories,
  cards,
  initialData,
  onOptimisticUpdate,
}) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [tagInput, setTagInput] = useState("");

  let initialTags = [];
  if (initialData?.tags) {
    try {
      initialTags =
        typeof initialData.tags === "string"
          ? JSON.parse(initialData.tags)
          : initialData.tags;
    } catch (e) {}
  }

  const [form, setForm] = useState(
    initialData
      ? {
          ...initialData,
          installments: initialData.total_installments || 1,
          tags: initialTags,
          is_fixed: !!initialData.is_fixed,
          is_repeated: !!initialData.is_repeated,
          ignore_in_reports: !!initialData.ignore_in_reports,
          repeat_frequency: initialData.repeat_frequency || 1,
          repeat_period: initialData.repeat_period || "monthly",
          notes: initialData.notes || "",
          attachment: null,
        }
      : {
          description: "",
          amount: "",
          date: new Date().toISOString().split("T")[0],
          type: "Expense",
          status: "Paid",
          account_id: accounts[0]?.id || "",
          to_account_id: "",
          category_id: categories[0]?.id || "",
          card_id: "",
          is_recurring: false,
          installments: 1,
          is_fixed: false,
          is_repeated: false,
          repeat_frequency: 1,
          repeat_period: "monthly",
          notes: "",
          tags: [],
          attachment: null,
          ignore_in_reports: false,
        },
  );

  const handleAddTag = (e) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!form.tags.includes(tagInput.trim())) {
        setForm({ ...form, tags: [...form.tags, tagInput.trim()] });
      }
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setForm({ ...form, tags: form.tags.filter((t) => t !== tagToRemove) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isEditing = !!initialData?.id;
    const url = isEditing
      ? `/api/transactions/${initialData.id}`
      : "/api/transactions";

    const formData = new FormData();
    if (isEditing) {
      formData.append("_method", "PUT");
    }

    const payloadParams = { ...form, amount: parseFloat(form.amount) };
    if (form.type === "Transfer") {
      if (
        !payloadParams.description ||
        payloadParams.description.trim() === ""
      ) {
        payloadParams.description = "Transferência";
      }
      payloadParams.status = "Paid";
    }

    if (form.is_repeated) {
      payloadParams.repeat_times = form.installments;
    } else {
      payloadParams.total_installments = form.installments;
    }

    Object.keys(payloadParams).forEach((key) => {
      const val = payloadParams[key];
      if (val !== null && val !== undefined && val !== "") {
        if (key === "tags") {
          if (val.length > 0) formData.append(key, JSON.stringify(val));
        } else if (key === "attachment") {
          formData.append(key, val);
        } else if (typeof val === "boolean") {
          formData.append(key, val ? "1" : "0");
        } else {
          formData.append(key, val);
        }
      }
    });

    if (onOptimisticUpdate)
      onOptimisticUpdate({ ...payloadParams, id: initialData?.id }, isEditing);

    await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: formData,
    });
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-zinc-200/50 dark:bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4 animate-in fade-in duration-300 ease-out">
      <div className="bg-fin-surface w-full max-w-lg rounded-[24px] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300 ease-out border border-zinc-900/10 dark:border-white/5">
        <div className="p-6 border-b border-zinc-900/10 dark:border-white/5 flex items-center justify-between bg-zinc-200/50 dark:bg-black/20">
          <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
            {initialData ? "Editar Transação" : "Nova Transação"}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-zinc-900/10 dark:hover:bg-white/5 rounded-full transition-colors text-zinc-500 dark:text-zinc-400"
          >
            <Plus size={20} className="rotate-45" />
          </button>
        </div>
        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-4 max-h-[80vh] overflow-y-auto custom-scrollbar"
        >
          <div className="grid grid-cols-3 gap-2 p-1 bg-zinc-200/50 dark:bg-black/20 rounded-2xl border border-zinc-900/10 dark:border-white/5">
            {[
              { id: "Income", label: "Receita" },
              { id: "Expense", label: "Despesa" },
              { id: "Transfer", label: "Transf." },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setForm({ ...form, type: t.id })}
                className={cn(
                  "py-2 text-sm font-bold rounded-xl transition-all",
                  form.type === t.id
                    ? t.id === "Income" || t.id === "Expense"
                      ? "bg-fin-surface shadow-sm text-fin-mint"
                      : "bg-fin-surface shadow-sm text-zinc-900 dark:text-white"
                    : "text-zinc-600 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-white",
                )}
              >
                {t.label}
              </button>
            ))}
          </div>

          {form.type !== "Transfer" && (
            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-600 dark:text-zinc-500 uppercase tracking-wider">
                Descrição
              </label>
              <input
                required
                className="w-full bg-zinc-200/50 dark:bg-black/20 border border-zinc-900/10 dark:border-white/5 rounded-2xl px-4 py-3 focus:ring-1 focus:ring-white/10 outline-none text-zinc-900 dark:text-white transition-all"
                placeholder="Ex: Aluguel Mensal"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-600 dark:text-zinc-500 uppercase tracking-wider">
                Valor
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 dark:text-zinc-500 font-bold">
                  R$
                </span>
                <input
                  required
                  type="number"
                  step="0.01"
                  className="w-full bg-zinc-200/50 dark:bg-black/20 border border-zinc-900/10 dark:border-white/5 rounded-2xl pl-10 pr-4 py-3 focus:ring-1 focus:ring-white/10 outline-none font-bold text-zinc-900 dark:text-white transition-all"
                  placeholder="0,00"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-600 dark:text-zinc-500 uppercase tracking-wider">
                Data
              </label>
              <CustomDatePicker
                value={form.date}
                onChange={(val) => setForm({ ...form, date: val })}
                triggerClassName="w-full bg-zinc-200/50 dark:bg-black/20 border border-zinc-900/10 dark:border-white/5 rounded-2xl px-4 py-3 focus:ring-1 focus:ring-white/10"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-600 dark:text-zinc-500 uppercase tracking-wider">
                {form.type === "Transfer" ? "Da Conta" : "Conta"}
              </label>
              <CustomSelect
                value={form.account_id}
                onChange={(val) => setForm({ ...form, account_id: val })}
                options={accounts.map((a) => ({ value: a.id, label: a.name }))}
              />
            </div>
            {form.type === "Transfer" ? (
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-600 dark:text-zinc-500 uppercase tracking-wider">
                  Para Conta
                </label>
                <CustomSelect
                  value={form.to_account_id}
                  onChange={(val) => setForm({ ...form, to_account_id: val })}
                  options={[
                    { value: "", label: "Selecionar Conta" },
                    ...accounts.map((a) => ({ value: a.id, label: a.name })),
                  ]}
                />
              </div>
            ) : (
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-600 dark:text-zinc-500 uppercase tracking-wider">
                  Categoria
                </label>
                <CustomSelect
                  value={form.category_id}
                  onChange={(val) => setForm({ ...form, category_id: val })}
                  options={(() => {
                    const parentCats = categories.filter(
                      (c) => !c.parent_id && c.type === form.type,
                    );
                    const grouped = [];
                    parentCats.forEach((parent) => {
                      const children = categories.filter(
                        (c) => c.parent_id === parent.id,
                      );
                      if (children.length > 0) {
                        grouped.push({ isGroup: true, label: parent.name });
                        grouped.push({ value: parent.id, label: parent.name });
                        children.forEach((child) => {
                          grouped.push({
                            value: child.id,
                            label: `↳ ${child.name}`,
                            indent: true,
                          });
                        });
                      } else {
                        grouped.push({ value: parent.id, label: parent.name });
                      }
                    });
                    return grouped;
                  })()}
                />
              </div>
            )}
          </div>

          {form.type !== "Transfer" && (
            <div className="grid grid-cols-2 gap-4">
              {form.type === "Expense" ? (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-600 dark:text-zinc-500 uppercase tracking-wider">
                    Forma de Pagamento
                  </label>
                  <CustomSelect
                    value={form.card_id}
                    onChange={(val) => setForm({ ...form, card_id: val })}
                    options={[
                      { value: "", label: "Direto da Conta" },
                      ...cards.map((c) => ({
                        value: c.id,
                        label: `${c.name} (Cartão)`,
                      })),
                    ]}
                  />
                </div>
              ) : (
                <div />
              )}
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-600 dark:text-zinc-500 uppercase tracking-wider">
                  Status
                </label>
                <label className="flex items-center gap-3 cursor-pointer group mt-1">
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={form.status === "Paid"}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          status: e.target.checked ? "Paid" : "Pending",
                        })
                      }
                    />
                    <div
                      className={cn(
                        "w-10 h-6 bg-zinc-300 dark:bg-zinc-700 rounded-full transition-all duration-300 ease-out",
                        form.status === "Paid" && "bg-fin-mint",
                      )}
                    ></div>
                    <div
                      className={cn(
                        "absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-all duration-300 ease-out shadow-sm",
                        form.status === "Paid" && "translate-x-4",
                      )}
                    ></div>
                  </div>
                  <span
                    className={cn(
                      "text-sm font-bold transition-colors",
                      form.status === "Paid"
                        ? "text-fin-mint"
                        : "text-zinc-500",
                    )}
                  >
                    {form.status === "Paid"
                      ? form.type === "Income"
                        ? "Recebido"
                        : form.type === "Expense"
                          ? "Pago"
                          : "Efetivada"
                      : "Pendente"}
                  </span>
                </label>
              </div>
            </div>
          )}

          {form.type !== "Transfer" ? (
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center justify-between w-full p-4 rounded-2xl bg-zinc-200/50 dark:bg-zinc-900/40 border border-zinc-900/10 dark:border-white/5 hover:bg-zinc-200/80 dark:hover:bg-zinc-900/60 transition-colors"
              >
                <span className="text-sm font-bold text-zinc-900 dark:text-white">
                  Mais Detalhes
                </span>
                <ChevronDown
                  className={cn(
                    "text-zinc-500 transition-transform duration-300",
                    showAdvanced && "rotate-180",
                  )}
                  size={20}
                />
              </button>

              <div
                className={cn(
                  "overflow-hidden transition-all duration-300 ease-in-out",
                  showAdvanced
                    ? "max-h-[800px] mt-2 opacity-100"
                    : "max-h-0 opacity-0",
                )}
              >
                <div className="p-4 space-y-5 border border-zinc-900/10 dark:border-white/5 rounded-2xl bg-zinc-200/30 dark:bg-black/20">
                  {form.type !== "Transfer" && (
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative flex items-center">
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={form.is_fixed}
                          onChange={(e) =>
                            setForm({ ...form, is_fixed: e.target.checked })
                          }
                        />
                        <div
                          className={cn(
                            "w-10 h-6 bg-zinc-300 dark:bg-zinc-700 rounded-full transition-colors",
                            form.is_fixed && "bg-fin-mint",
                          )}
                        ></div>
                        <div
                          className={cn(
                            "absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform",
                            form.is_fixed && "translate-x-4",
                          )}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">
                        {form.type === "Income"
                          ? "Receita Fixa"
                          : "Despesa Fixa"}
                      </span>
                    </label>
                  )}

                  <div>
                    <label className="flex items-center gap-3 cursor-pointer group mb-3">
                      <div className="relative flex items-center">
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={form.is_repeated}
                          onChange={(e) =>
                            setForm({ ...form, is_repeated: e.target.checked })
                          }
                        />
                        <div
                          className={cn(
                            "w-10 h-6 bg-zinc-300 dark:bg-zinc-700 rounded-full transition-colors",
                            form.is_repeated && "bg-fin-mint",
                          )}
                        ></div>
                        <div
                          className={cn(
                            "absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform",
                            form.is_repeated && "translate-x-4",
                          )}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">
                        Repetir Transação
                      </span>
                    </label>

                    {form.is_repeated && (
                      <div className="grid grid-cols-2 gap-4 pl-13 animate-in slide-in-from-top-2 fade-in">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-zinc-600 dark:text-zinc-500 uppercase tracking-wider">
                            A cada
                          </label>
                          <input
                            type="number"
                            min="1"
                            className="w-full bg-zinc-200/50 dark:bg-black/20 border border-zinc-900/10 dark:border-white/5 rounded-xl px-3 py-2 text-sm focus:ring-1 focus:ring-white/10 outline-none text-zinc-900 dark:text-white transition-all"
                            value={form.repeat_frequency}
                            onChange={(e) =>
                              setForm({
                                ...form,
                                repeat_frequency: parseInt(e.target.value),
                              })
                            }
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-zinc-600 dark:text-zinc-500 uppercase tracking-wider">
                            Período
                          </label>
                          <CustomSelect
                            value={form.repeat_period}
                            onChange={(val) =>
                              setForm({ ...form, repeat_period: val })
                            }
                            triggerClassName="w-full bg-zinc-200/50 dark:bg-black/20 border border-zinc-900/10 dark:border-white/5 rounded-xl px-3 py-2 text-sm text-zinc-900 dark:text-white hover:bg-zinc-200/80 dark:hover:bg-white/5 focus:ring-1 focus:ring-white/10"
                            options={[
                              { value: "daily", label: "Dia(s)" },
                              { value: "weekly", label: "Semana(s)" },
                              { value: "monthly", label: "Mês(es)" },
                              { value: "yearly", label: "Ano(s)" },
                            ]}
                          />
                        </div>
                        <div className="space-y-1 col-span-2">
                          <label className="text-xs font-bold text-zinc-600 dark:text-zinc-500 uppercase tracking-wider">
                            Quantidade de vezes a repetir
                          </label>
                          <input
                            type="number"
                            min="1"
                            placeholder="Ex: 12"
                            className="w-full bg-zinc-200/50 dark:bg-black/20 border border-zinc-900/10 dark:border-white/5 rounded-xl px-3 py-2 text-sm focus:ring-1 focus:ring-white/10 outline-none text-zinc-900 dark:text-white transition-all"
                            value={form.installments}
                            onChange={(e) =>
                              setForm({
                                ...form,
                                installments: parseInt(e.target.value),
                              })
                            }
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-600 dark:text-zinc-500 uppercase tracking-wider">
                      Observações
                    </label>
                    <textarea
                      rows={2}
                      className="w-full bg-zinc-200/50 dark:bg-black/20 border border-zinc-900/10 dark:border-white/5 rounded-2xl px-4 py-3 text-sm focus:ring-1 focus:ring-white/10 outline-none text-zinc-900 dark:text-white transition-all resize-none"
                      placeholder="Adicione notas adicionais..."
                      value={form.notes}
                      onChange={(e) =>
                        setForm({ ...form, notes: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-600 dark:text-zinc-500 uppercase tracking-wider">
                      Tags
                    </label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {form.tags &&
                        form.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center gap-1 bg-zinc-900/10 dark:bg-white/10 px-3 py-1 rounded-full text-xs font-medium text-zinc-700 dark:text-zinc-300"
                          >
                            {tag}
                            <button
                              type="button"
                              onClick={() => handleRemoveTag(tag)}
                              className="hover:text-red-400 text-zinc-500 dark:text-zinc-400"
                            >
                              <Plus size={12} className="rotate-45" />
                            </button>
                          </span>
                        ))}
                    </div>
                    <input
                      type="text"
                      className="w-full bg-zinc-200/50 dark:bg-black/20 border border-zinc-900/10 dark:border-white/5 rounded-xl px-4 py-2.5 text-sm focus:ring-1 focus:ring-white/10 outline-none text-zinc-900 dark:text-white transition-all"
                      placeholder="Digite e aperte Enter para adicionar"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleAddTag}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-600 dark:text-zinc-500 uppercase tracking-wider">
                      Anexo (Opcional)
                    </label>
                    <input
                      type="file"
                      className="w-full text-sm text-zinc-500 dark:text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-fin-mint/10 file:text-fin-mint hover:file:bg-fin-mint/20 cursor-pointer"
                      onChange={(e) =>
                        setForm({ ...form, attachment: e.target.files[0] })
                      }
                    />
                    {initialData?.attachment_path && (
                      <p className="text-xs text-zinc-500 mt-1">
                        Já possui um anexo salvo.
                      </p>
                    )}
                  </div>

                  <label className="flex items-center gap-3 cursor-pointer group mt-2 pt-4 border-t border-zinc-900/10 dark:border-white/5">
                    <div className="relative flex items-center">
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={form.ignore_in_reports}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            ignore_in_reports: e.target.checked,
                          })
                        }
                      />
                      <div
                        className={cn(
                          "w-10 h-6 bg-zinc-300 dark:bg-zinc-700 rounded-full transition-colors",
                          form.ignore_in_reports && "bg-fin-mint",
                        )}
                      ></div>
                      <div
                        className={cn(
                          "absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform",
                          form.ignore_in_reports && "translate-x-4",
                        )}
                      ></div>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">
                        Ignorar em Relatórios
                      </span>
                      <span className="text-xs text-zinc-500">
                        Não contabilizar em saldos e gráficos automáticos.
                      </span>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-1 pt-2">
              <label className="text-xs font-bold text-zinc-600 dark:text-zinc-500 uppercase tracking-wider">
                Observações (Opcional)
              </label>
              <textarea
                rows={2}
                className="w-full bg-zinc-200/50 dark:bg-black/20 border border-zinc-900/10 dark:border-white/5 rounded-2xl px-4 py-3 text-sm focus:ring-1 focus:ring-white/10 outline-none text-zinc-900 dark:text-white transition-all resize-none"
                placeholder="Adicione notas adicionais..."
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-fin-mint text-fin-bg py-4 rounded-2xl font-bold hover:brightness-110 transition-all shadow-lg shadow-fin-mint/20 mt-6"
          >
            Salvar Transação
          </button>
        </form>
      </div>
    </div>
  );
}