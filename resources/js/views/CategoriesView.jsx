import React, { useMemo, useState } from "react";
import { 
  Plus, 
  ListTree, 
  Settings, 
  Trash2, 
  Tag, 
  ArrowUpRight, 
  ArrowDownLeft, 
  ChevronDown 
} from "lucide-react";
import { CATEGORY_ICONS } from "../constants/theme";
import { cn } from "../utils/classNames";
import CategoryModal from "../modals/CategoryModal";


export default function CategoriesView({
  categories,
  setCategories,
  fetchData,
  showToast,
  showConfirm,
  selectedProfile,
  isReadOnly,
  searchTerm,
}) {
  const profileCategories = useMemo(
    () => categories.filter((c) => c.user_id === selectedProfile?.id),
    [categories, selectedProfile],
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [defaultParentId, setDefaultParentId] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState("all");

  const filteredCategories = useMemo(() => {
    if (!searchTerm) return profileCategories;
    const term = searchTerm.toLowerCase();
    return profileCategories.filter((c) => c.name.toLowerCase().includes(term));
  }, [profileCategories, searchTerm]);

  const allParentCategories = filteredCategories.filter((c) => !c.parent_id);
  const parentCategories =
    categoryFilter === "all"
      ? allParentCategories
      : allParentCategories.filter((c) => c.type === categoryFilter);

  const incomeCount = allParentCategories.filter(
    (c) => c.type === "Income",
  ).length;
  const expenseCount = allParentCategories.filter(
    (c) => c.type === "Expense",
  ).length;

  const filterTabs = [
    { id: "all", label: "Todas", count: allParentCategories.length },
    { id: "Income", label: "Receitas", count: incomeCount },
    { id: "Expense", label: "Despesas", count: expenseCount },
  ];

  const handleEdit = (category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setEditingCategory(null);
    setDefaultParentId(null);
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    showConfirm(
      "Excluir Categoria",
      "Tem certeza que deseja excluir esta categoria?",
      async () => {
        const previousState = [...categories];
        setCategories((prev) => prev.filter((c) => c.id !== id));

        try {
          const res = await fetch(`/api/categories/${id}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          if (res.ok) {
            showToast("Categoria excluída com sucesso!", "success");
            fetchData();
          } else {
            setCategories(previousState);
            showToast("Erro ao excluir categoria.", "error");
          }
        } catch (e) {
          setCategories(previousState);
          showToast("Erro de conexão.", "error");
        }
      },
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mt-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white mb-1">
            Categorias
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Classificação para organizar transações.
          </p>
        </div>
        {!isReadOnly && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-fin-mint text-fin-bg px-5 py-2.5 rounded-full font-bold flex items-center gap-2 hover:brightness-110 tracking-tight text-sm transition-all shadow-lg shadow-fin-mint/10"
          >
            <Plus size={18} strokeWidth={3} /> Add Categoria
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-zinc-200/50 dark:bg-black/20 rounded-2xl border border-zinc-900/10 dark:border-white/5 w-fit">
        {filterTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setCategoryFilter(tab.id)}
            className={cn(
              "px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 flex items-center gap-2",
              categoryFilter === tab.id
                ? tab.id === "Income"
                  ? "bg-fin-surface shadow-sm text-fin-mint"
                  : tab.id === "Expense"
                    ? "bg-fin-surface shadow-sm text-[#ff7b7b]"
                    : "bg-fin-surface shadow-sm text-zinc-900 dark:text-white"
                : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300",
            )}
          >
            {tab.id === "Income" && <ArrowUpRight size={14} />}
            {tab.id === "Expense" && <ArrowDownLeft size={14} />}
            {tab.label}
            <span
              className={cn(
                "text-[10px] font-bold px-1.5 py-0.5 rounded-md min-w-[20px] text-center",
                categoryFilter === tab.id
                  ? tab.id === "Income"
                    ? "bg-fin-mint/15 text-fin-mint"
                    : tab.id === "Expense"
                      ? "bg-[#ff7b7b]/15 text-[#ff7b7b]"
                      : "bg-zinc-900/10 dark:bg-white/10 text-zinc-600 dark:text-zinc-300"
                  : "bg-zinc-900/5 dark:bg-white/5 text-zinc-500",
              )}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {parentCategories.length === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-zinc-900/10 dark:bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Tag size={28} className="text-zinc-500" />
          </div>
          <p className="text-zinc-500 dark:text-zinc-400 font-medium">
            {categoryFilter === "all"
              ? "Nenhuma categoria cadastrada."
              : categoryFilter === "Income"
                ? "Nenhuma categoria de receita."
                : "Nenhuma categoria de despesa."}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {parentCategories.map((parent) => (
          <div
            key={parent.id}
            className="bg-fin-surface p-7 rounded-[24px] border border-zinc-900/10 dark:border-white/5 shadow-2xl transition-all hover:border-zinc-900/10 dark:border-white/10 group"
          >
            <div className="flex items-center gap-4 mb-6 relative w-full justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-zinc-900/10 dark:bg-white/5 text-zinc-600 dark:text-zinc-300 rounded-[16px] flex items-center justify-center">
                  {parent.icon && CATEGORY_ICONS[parent.icon] ? (
                    React.cloneElement(CATEGORY_ICONS[parent.icon], {
                      size: 20,
                    })
                  ) : (
                    <Tag size={20} />
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-zinc-900 dark:text-white text-lg">
                    {parent.name}
                  </h4>
                  <p
                    className={cn(
                      "text-[10px] font-bold uppercase tracking-wider mt-0.5",
                      parent.type === "Income"
                        ? "text-fin-mint"
                        : "text-[#ff7b7b]",
                    )}
                  >
                    {parent.type === "Income" ? "Receita" : "Despesa"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {!isReadOnly && (
                  <>
                    <button
                      onClick={() => handleEdit(parent)}
                      className="p-2 text-zinc-600 hover:text-fin-mint transition-colors"
                    >
                      <Settings size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(parent.id)}
                      className="p-2 text-zinc-600 hover:text-[#ff7b7b] transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </>
                )}
              </div>
            </div>
            <div className="space-y-2 mt-6 p-4 rounded-[16px] bg-zinc-200/50 dark:bg-black/20 border border-zinc-900/10 dark:border-white/5">
              {filteredCategories.filter((c) => c.parent_id === parent.id)
                .length === 0 && (
                <p className="text-zinc-600 text-xs italic text-center py-2">
                  Sem subcategorias
                </p>
              )}
              {filteredCategories
                .filter((c) => c.parent_id === parent.id)
                .map((child) => (
                  <div
                    key={child.id}
                    className="flex items-center justify-between p-2 hover:bg-zinc-900/10 dark:hover:bg-white/5 dark:bg-white/[0.02] rounded-xl group/item"
                  >
                    <div className="flex items-center gap-2">
                      <div className="text-zinc-600 dark:text-zinc-400">
                        {child.icon && CATEGORY_ICONS[child.icon] ? (
                          React.cloneElement(CATEGORY_ICONS[child.icon], {
                            size: 14,
                          })
                        ) : (
                          <Tag size={14} />
                        )}
                      </div>
                      <span className="text-sm font-medium text-zinc-600 dark:text-zinc-300">
                        {child.name}
                      </span>
                    </div>
                    {!isReadOnly && (
                      <div className="flex items-center gap-1 opacity-0 group-hover/item:opacity-100 transition-all">
                        <button
                          onClick={() => handleEdit(child)}
                          className="p-1 px-1.5 text-zinc-600 hover:text-fin-mint transition-colors"
                        >
                          <Settings size={12} />
                        </button>
                        <button
                          onClick={() => handleDelete(child.id)}
                          className="p-1 px-1.5 text-zinc-600 hover:text-[#ff7b7b] transition-colors"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              {!isReadOnly && (
                <div className="pt-2">
                  <button
                    onClick={() => {
                      setDefaultParentId(parent.id);
                      setIsModalOpen(true);
                    }}
                    className="w-full text-center text-[11px] uppercase tracking-wider text-fin-mint font-bold py-2.5 hover:bg-fin-mint/10 rounded-xl transition-colors border border-dashed border-fin-mint/20 hover:border-fin-mint/40"
                  >
                    + Add Subcategoria
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <CategoryModal
          onClose={handleClose}
          onSuccess={() => fetchData()}
          categories={allParentCategories}
          initialData={editingCategory}
          defaultParentId={defaultParentId}
          onOptimisticUpdate={(data, isEditing) => {
            if (isEditing) {
              setCategories((prev) =>
                prev.map((c) => (c.id === data.id ? { ...c, ...data } : c)),
              );
            } else {
              setCategories((prev) => [...prev, { ...data, id: Date.now() }]);
            }
          }}
        />
      )}
    </div>
  );
}
