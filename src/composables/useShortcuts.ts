import { onMounted, onBeforeUnmount } from "vue";

interface ShortcutConfig {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  handler: () => void;
  description?: string;
}

const registeredShortcuts: ShortcutConfig[] = [];

function matchShortcut(e: KeyboardEvent, config: ShortcutConfig): boolean {
  const keyMatch = e.key.toLowerCase() === config.key.toLowerCase();
  const ctrlMatch = config.ctrl
    ? e.ctrlKey || e.metaKey
    : !e.ctrlKey && !e.metaKey;
  const shiftMatch = config.shift ? e.shiftKey : !e.shiftKey;
  const altMatch = config.alt ? e.altKey : !e.altKey;
  return keyMatch && ctrlMatch && shiftMatch && altMatch;
}

function isInputTarget(e: KeyboardEvent): boolean {
  const target = e.target as HTMLElement;
  const tagName = target.tagName.toLowerCase();
  return (
    tagName === "input" || tagName === "textarea" || target.isContentEditable
  );
}

function handleKeydown(e: KeyboardEvent) {
  if (isInputTarget(e)) return;

  for (const config of registeredShortcuts) {
    if (matchShortcut(e, config)) {
      e.preventDefault();
      config.handler();
      break;
    }
  }
}

let globalListenerAdded = false;

function ensureGlobalListener() {
  if (!globalListenerAdded) {
    window.addEventListener("keydown", handleKeydown);
    globalListenerAdded = true;
  }
}

export function useShortcuts(shortcuts: ShortcutConfig[]) {
  onMounted(() => {
    ensureGlobalListener();
    registeredShortcuts.push(...shortcuts);
  });

  onBeforeUnmount(() => {
    shortcuts.forEach((sc) => {
      const idx = registeredShortcuts.indexOf(sc);
      if (idx > -1) {
        registeredShortcuts.splice(idx, 1);
      }
    });
  });
}

export function useGlobalShortcuts() {
  const shortcuts: ShortcutConfig[] = [
    {
      key: "k",
      ctrl: true,
      description: "搜索",
      handler: () => {
        const searchInput = document.querySelector(
          ".global-search input"
        ) as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
      },
    },
    {
      key: "Escape",
      description: "关闭弹窗/清除选中",
      handler: () => {
        document.querySelectorAll(".el-dialog__close").forEach((btn) => {
          (btn as HTMLElement).click();
        });
      },
    },
  ];

  onMounted(() => {
    ensureGlobalListener();
    registeredShortcuts.push(...shortcuts);
  });
}
