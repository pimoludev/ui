"use client";
import { usePartClasses } from "../internal/use-part-classes";
import { mergeClasses } from "../internal/merge-classes";


import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
  type SyntheticEvent,
} from "react";

import type {
  PimoluMentionsOption,
  PimoluMentionsProps,
} from "./mentions.types";

import { normalizeSearch } from "../internal/search";
import { Portal } from "../internal/portal";
import { useAnchoredPosition } from "../internal/use-anchored-position";
import { useDismissableLayer } from "../internal/use-dismissable-layer";
import { useFormReset } from "../internal/use-form-reset";

/* =========================================
   TRIGGER CONTEXT
========================================= */

interface MentionContext {
  /** Index of the trigger character. */
  start: number;

  /** Caret position when the context was captured. */
  end: number;

  /** Text typed between the trigger and the caret. */
  query: string;
}

/**
 * Returns the mention being typed at `caret`, if any. A trigger only opens a
 * mention when it is at the start of the text or follows whitespace, so an
 * email address like `hello@example.com` never opens the list.
 */
function getMentionContext(
  text: string,
  caret: number,
  trigger: string
): MentionContext | null {
  if (trigger.length === 0) return null;

  const safeCaret = Math.max(
    0,
    Math.min(caret, text.length)
  );

  const before = text.slice(0, safeCaret);
  const start = before.lastIndexOf(trigger);

  if (start < 0) return null;

  const preceding =
    start === 0 ? "" : before[start - 1];

  if (preceding !== "" && !/\s/.test(preceding)) {
    return null;
  }

  const query = before.slice(start + trigger.length);

  /* A mention is a single token: whitespace ends the query. */
  if (/[\s\u00a0]/.test(query)) return null;

  return { start, end: safeCaret, query };
}

interface Suggestion {
  option: PimoluMentionsOption;
  create: boolean;
}

/* =========================================
   MENTIONS
========================================= */

export const Mentions = forwardRef<
  HTMLTextAreaElement,
  PimoluMentionsProps
>(function Mentions(
  { classNames,
    id,
    name,

    options,
    value,
    defaultValue = "",

    onValueChange,
    onSelect,

    trigger = "@",
    maxSuggestions = 6,

    placeholder = "Type a message…",
    label,
    helperText,
    disabled = false,
    allowCreate = false,

    rows = 3,
    maxLength,
    required = false,
    fullWidth = false,

    className,
    textareaClassName,
    style,

    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    "aria-describedby": ariaDescribedBy,
  },
  forwardedRef
) {
  const [partClasses, scopeParts] = usePartClasses("mentions", classNames, true);

  /* ======================================
     IDS AND REFS
  ====================================== */

  const generatedId = useId();
  const inputId = id ?? `pimolu-mentions-${generatedId}`;
  const listboxId = `${inputId}-listbox`;
  const helperId = `${inputId}-helper`;

  const rootRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);

  const assignRef = useCallback(
    (node: HTMLTextAreaElement | null) => {
      textareaRef.current = node;

      if (typeof forwardedRef === "function") {
        forwardedRef(node);
      } else if (forwardedRef) {
        forwardedRef.current = node;
      }
    },
    [forwardedRef]
  );

  /* ======================================
     CONTROLLED / UNCONTROLLED VALUE
  ====================================== */

  const isControlled = value !== undefined;

  const [internalValue, setInternalValue] =
    useState(defaultValue);

  const text = isControlled
    ? String(value ?? "")
    : internalValue;

  /* ======================================
     SUGGESTION STATE
  ====================================== */

  const [isOpen, setIsOpen] = useState(false);
  const [context, setContext] =
    useState<MentionContext | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [dismissed, setDismissed] =
    useState(false);

  /* A caret position applied after a selection re-renders. */
  const [caretRequest, setCaretRequest] = useState<{
    position: number;
  } | null>(null);

  const filteredOptions = useMemo(() => {
    if (!context) return [];

    const query = normalizeSearch(context.query);

    const matches = options.filter((option) => {
      if (!query) return true;

      return normalizeSearch(
        [
          option.label,
          option.description ?? "",
        ].join(" ")
      ).includes(query);
    });

    return matches.slice(
      0,
      Math.max(0, maxSuggestions)
    );
  }, [context, options, maxSuggestions]);

  const createOption = useMemo<{
    id: string;
    label: string;
  } | null>(() => {
    if (
      !allowCreate ||
      !context ||
      context.query.trim() === ""
    ) {
      return null;
    }

    const query = normalizeSearch(context.query);

    const exists = options.some(
      (option) =>
        normalizeSearch(option.label) === query
    );

    if (exists) return null;

    return {
      id: context.query,
      label: context.query,
    };
  }, [allowCreate, context, options]);

  const suggestions = useMemo<Suggestion[]>(() => {
    const entries: Suggestion[] = filteredOptions.map(
      (option) => ({ option, create: false })
    );

    if (createOption) {
      entries.push({
        option: {
          id: createOption.id,
          label: createOption.label,
        },
        create: true,
      });
    }

    return entries;
  }, [filteredOptions, createOption]);

  const suggestionsOpen =
    isOpen &&
    !disabled &&
    context !== null &&
    (suggestions.length > 0 || filteredOptions.length === 0);

  const safeActiveIndex = Math.min(
    activeIndex,
    Math.max(suggestions.length - 1, 0)
  );

  const activeSuggestion =
    suggestions[safeActiveIndex];

  const activeDescendant =
    suggestionsOpen && activeSuggestion
      ? `${listboxId}-option-${safeActiveIndex}`
      : undefined;

  /* ======================================
     HELPERS
  ====================================== */

  const commit = useCallback(
    (nextText: string) => {
      if (!isControlled) {
        setInternalValue(nextText);
      }

      onValueChange?.(nextText);
    },
    [isControlled, onValueChange]
  );

  const closeMenu = useCallback(() => {
    setIsOpen(false);
    setContext(null);
    setActiveIndex(0);
  }, []);

  function syncContext(
    nextText: string,
    caret: number,
    forceOpen: boolean
  ) {
    const nextContext = getMentionContext(
      nextText,
      caret,
      trigger
    );

    setContext(nextContext);

    if (!nextContext || disabled) {
      setIsOpen(false);
      setDismissed(false);
      return;
    }

    if (dismissed && !forceOpen) {
      setIsOpen(false);
      return;
    }

    setActiveIndex(0);
    setDismissed(false);
    setIsOpen(true);
  }

  function handlesTextInput(
    event: SyntheticEvent<HTMLTextAreaElement>
  ) {
    const element = event.currentTarget;

    syncContext(
      element.value,
      element.selectionStart ?? element.value.length,
      false
    );
  }

  function handleChange(
    event: ChangeEvent<HTMLTextAreaElement>
  ) {
    const nextText = event.currentTarget.value;

    commit(nextText);

    syncContext(
      nextText,
      event.currentTarget.selectionStart ??
        nextText.length,
      true
    );
  }

  function handleSelectSuggestion(
    suggestion: Suggestion
  ) {
    if (disabled || !context) return;

    const before = text.slice(0, context.start);
    const after = text.slice(context.end);

    const mention = `${trigger}${suggestion.option.label}`;
    const insertion = `${mention} `;
    const nextText = `${before}${insertion}${after}`;
    const caret =
      context.start + insertion.length;

    commit(nextText);

    onSelect?.(suggestion.option);

    setIsOpen(false);
    setContext(null);
    setActiveIndex(0);
    setDismissed(true);
    setCaretRequest({ position: caret });
  }

  function moveActive(step: number) {
    if (suggestions.length === 0) return;

    setActiveIndex((current) => {
      const start = Math.min(
        current,
        suggestions.length - 1
      );

      return (
        (start + step + suggestions.length) %
        suggestions.length
      );
    });
  }

  /* ======================================
     KEYBOARD
  ====================================== */

  function handleKeyDown(
    event: KeyboardEvent<HTMLTextAreaElement>
  ) {
    if (disabled) return;

    if (event.nativeEvent.isComposing) return;

    if (
      event.key === "Escape" &&
      suggestionsOpen
    ) {
      event.preventDefault();
      setIsOpen(false);
      setDismissed(true);
      return;
    }

    if (!suggestionsOpen) return;

    if (
      event.key === "ArrowDown" ||
      event.key === "ArrowUp"
    ) {
      event.preventDefault();
      moveActive(event.key === "ArrowDown" ? 1 : -1);
      return;
    }

    if (
      (event.key === "Enter" ||
        event.key === "Tab") &&
      activeSuggestion
    ) {
      event.preventDefault();
      handleSelectSuggestion(activeSuggestion);
      return;
    }

    if (event.key === "Tab") {
      setIsOpen(false);
    }
  }

  /* ======================================
     SHARED BEHAVIOURS
  ====================================== */

  const { style: popupStyle } = useAnchoredPosition(
    rootRef,
    listboxRef,
    suggestionsOpen,
    {
      gap: 6,
      maxHeight: 280,
      matchWidth: true,
    }
  );

  useDismissableLayer({
    open: suggestionsOpen,
    target: [rootRef, listboxRef],
    onDismiss: closeMenu,
  });

  useFormReset(textareaRef, !isControlled, () => {
    setInternalValue(defaultValue);
    setContext(null);
    setIsOpen(false);
    setActiveIndex(0);
  });

  /* Keep the active suggestion in view. */
  useEffect(() => {
    if (!suggestionsOpen) return;

    listboxRef.current
      ?.querySelector<HTMLElement>(
        '[data-active="true"]'
      )
      ?.scrollIntoView?.({ block: "nearest" });
  }, [suggestionsOpen, safeActiveIndex]);

  /* Restore the caret after inserting a mention. */
  useEffect(() => {
    if (!caretRequest) return;

    const element = textareaRef.current;

    if (element) {
      element.focus();

      element.setSelectionRange(
        caretRequest.position,
        caretRequest.position
      );
    }

    setCaretRequest(null);
  }, [caretRequest]);

  /* ======================================
     CLASSES
  ====================================== */

  const rootClassName = [
    "pimolu-mentions",
    fullWidth && "pimolu-mentions--full-width",
    disabled && "pimolu-mentions--disabled",
    suggestionsOpen && "pimolu-mentions--open",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return scopeParts((
    <div
      ref={rootRef}
      className={mergeClasses(rootClassName, partClasses.root)}
      style={style}
    >
      {label && (
        <label
          htmlFor={inputId}
          className={mergeClasses("pimolu-mentions__label", partClasses.label)}
        >
          {label}

          {required && (
            <span
              className={mergeClasses("pimolu-mentions__required", partClasses.required)}
              aria-hidden="true"
            >
              *
            </span>
          )}
        </label>
      )}

      <div className={mergeClasses("pimolu-mentions__field", partClasses.field)}>
        <textarea
          ref={assignRef}
          id={inputId}
          name={name}
          rows={rows}
          maxLength={maxLength}
          required={required}
          disabled={disabled}
          placeholder={placeholder}

          className={mergeClasses([
            "pimolu-mentions__textarea",
            textareaClassName,
          ]
            .filter(Boolean)
            .join(" "), partClasses.textarea)}

          value={text}

          role="combobox"
          aria-autocomplete="list"
          aria-haspopup="listbox"
          aria-expanded={suggestionsOpen}
          aria-controls={
            suggestionsOpen ? listboxId : undefined
          }
          aria-activedescendant={activeDescendant}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
          aria-describedby={
            [ariaDescribedBy, helperText ? helperId : null]
              .filter(Boolean)
              .join(" ") || undefined
          }
          aria-required={required || undefined}

          onChange={handleChange}
          onClick={handlesTextInput}
          onKeyUp={(event) => {
            if (
              event.key === "ArrowLeft" ||
              event.key === "ArrowRight" ||
              event.key === "Home" ||
              event.key === "End"
            ) {
              handlesTextInput(event);
            }
          }}
          onFocus={handlesTextInput}
          onBlur={(event) => {
            const next = event.relatedTarget;

            if (
              !(next instanceof Node) ||
              (!rootRef.current?.contains(next) &&
                !listboxRef.current?.contains(next))
            ) {
              closeMenu();
            }
          }}
          onKeyDown={handleKeyDown}
        />

        {suggestionsOpen && (
          <Portal anchorRef={rootRef}>
            <ul
              ref={listboxRef}
              id={listboxId}
              role="listbox"
              aria-label={
                label
                  ? `Mentions: ${label}`
                  : "Mentions"
              }
              className={mergeClasses("pimolu-mentions__listbox", partClasses.listbox)}
              style={popupStyle}
            >
              {suggestions.length === 0 ? (
                <li
                  className={mergeClasses("pimolu-mentions__empty", partClasses.empty)}
                  role="presentation"
                >
                  <span role="status">
                    No suggestions found.
                  </span>
                </li>
              ) : (
                suggestions.map((suggestion, index) => {
                  const { option } = suggestion;

                  return (
                    <li
                      key={`${option.id}-${index}`}
                      id={`${listboxId}-option-${index}`}
                      role="option"
                      aria-label={
                        suggestion.create
                          ? `Create ${option.label}`
                          : option.label
                      }
                      aria-selected={index === safeActiveIndex}
                      aria-describedby={
                        option.description
                          ? `${listboxId}-option-${index}-description`
                          : undefined
                      }
                      data-active={
                        index === safeActiveIndex
                          ? "true"
                          : undefined
                      }
                      data-create={
                        suggestion.create
                          ? "true"
                          : undefined
                      }
                      className={mergeClasses([
                        "pimolu-mentions__option",
                        suggestion.create &&
                          "pimolu-mentions__option--create",
                      ]
                        .filter(Boolean)
                        .join(" "), partClasses.option)}

                      onMouseDown={(event) => {
                        event.preventDefault();
                      }}
                      onMouseMove={() => {
                        setActiveIndex(index);
                      }}
                      onClick={() => {
                        handleSelectSuggestion(suggestion);
                      }}
                    >
                      {option.avatar && (
                        <span
                          className={mergeClasses("pimolu-mentions__avatar", partClasses.avatar)}
                          aria-hidden="true"
                        >
                          {option.avatar}
                        </span>
                      )}

                      <span className={mergeClasses("pimolu-mentions__option-main", partClasses.optionMain)}>
                        <span className={mergeClasses("pimolu-mentions__option-label", partClasses.optionLabel)}>
                          {suggestion.create
                            ? `Create “${option.label}”`
                            : option.label}
                        </span>

                        {option.description && (
                          <span
                            id={`${listboxId}-option-${index}-description`}
                            className={mergeClasses("pimolu-mentions__option-description", partClasses.optionDescription)}
                          >
                            {option.description}
                          </span>
                        )}
                      </span>

                      {suggestion.create && (
                        <span
                          className={mergeClasses("pimolu-mentions__create-mark", partClasses.createMark)}
                          aria-hidden="true"
                        >
                          +
                        </span>
                      )}
                    </li>
                  );
                })
              )}
            </ul>
          </Portal>
        )}
      </div>

      {helperText && (
        <p
          id={helperId}
          className={mergeClasses("pimolu-mentions__helper", partClasses.helper)}
        >
          {helperText}
        </p>
      )}
    </div>
  ));
});

Mentions.displayName = "PimoluMentions";
