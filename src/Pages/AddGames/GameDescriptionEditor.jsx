import React, { useState, useEffect, useCallback } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { LinkPlugin as LexicalLinkPlugin } from "@lexical/react/LexicalLinkPlugin";

// --- Lexical Core Imports ---
import {
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
  REDO_COMMAND,
  createCommand,
  $createParagraphNode,
  ParagraphNode,
  DecoratorNode,
} from "lexical";
import { $generateHtmlFromNodes } from "@lexical/html";
import { $setBlocksType } from "@lexical/selection";
import { mergeRegister, $getNearestNodeOfType } from "@lexical/utils"; 

// --- Node Imports ---
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
  ListNode,
  ListItemNode,
  $isListNode,
} from "@lexical/list";
import {
  $createHeadingNode,
  $isHeadingNode,
  $createQuoteNode,
  $isQuoteNode,
  HeadingNode,
  QuoteNode,
} from "@lexical/rich-text";
import { $createCodeNode, CodeNode } from "@lexical/code";
import { $isLinkNode, TOGGLE_LINK_COMMAND, LinkNode } from "@lexical/link";

// --- Configuration Data ---
const FONT_FAMILY_OPTIONS = [
  ["Default (Arial)", "Arial"],
  ["Courier New", "Courier New"],
  ["Georgia", "Georgia"],
  ["Times New Roman", "Times New Roman"],
];

const FONT_SIZE_OPTIONS = [
  ["Small (12px)", "12px"],
  ["Normal (16px)", "16px"],
  ["Large (20px)", "20px"],
  ["Huge (24px)", "24px"],
];

// Block Types for the dropdown
const BLOCK_TYPE_OPTIONS = {
  paragraph: "Paragraph",
  h1: "Heading 1",
  h2: "Heading 2",
  h3: "Heading 3",
  quote: "Quote",
  ul: "Bulleted List",
  ol: "Numbered List",
};

// --- Styles ---
const editorStyle = {
  minHeight: "200px", 
  padding: "15px", 
  borderRadius: "0 0 6px 6px", 
  backgroundColor: "white",
  textAlign: "left",
  fontSize: "16px", 
};

// --- Custom YouTube Embed Node ---
export const INSERT_YOUTUBE_COMMAND = createCommand("INSERT_YOUTUBE_COMMAND");

function YouTubeComponent({ videoID, className }) {
  return (
    <div
      className={`youtube-embed-container ${className}`}
      style={{ display: "flex", justifyContent: "center", margin: "1rem 0" }}
    >
      <div style={{ position: "relative", width: "100%", maxWidth: "560px" }}>
        <div
          style={{ paddingBottom: "56.25%", position: "relative", height: 0 }}
        >
          <iframe
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
            }}
            src={`https://www.youtube.com/embed/${videoID}`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="Embedded YouTube video"
          />
        </div>
      </div>
    </div>
  );
}

export class YouTubeNode extends DecoratorNode {
  __videoID;

  static getType() {
    return "youtube";
  }
  static clone(node) {
    return new YouTubeNode(node.__videoID, node.__key);
  }
  constructor(videoID, key) {
    super(key);
    this.__videoID = videoID;
  }
  createDOM(config) {
    const div = document.createElement("div");
    const className = config.theme.youtube;
    if (className) {
      div.className = className;
    }
    return div;
  }
  updateDOM() {
    return false;
  }
  decorate() {
    return (
      <YouTubeComponent
        videoID={this.__videoID}
        className={this.getLatest().createDOM(this.getEditorConfig()).className}
      />
    );
  }
  static importJSON(serializedNode) {
    return $createYouTubeNode(serializedNode.videoID);
  }
  exportJSON() {
    return {
      type: "youtube",
      version: 1,
      videoID: this.__videoID,
    };
  }
}

export function $createYouTubeNode(videoID) {
  return new YouTubeNode(videoID);
}

function YouTubePlugin() {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    return editor.registerCommand(
      INSERT_YOUTUBE_COMMAND,
      (payload) => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          const youTubeNode = $createYouTubeNode(payload);
          selection.insertNodes([youTubeNode]);
        }
        return true;
      },
      0
    );
  }, [editor]);
  return null;
}
// --- END YouTubeNode ---

// --- Initial Config ---
const initialConfig = {
  namespace: "GameDescriptionEditor",
  theme: {
    // Tailwind classes for formatting
    text: {
      bold: "font-bold",
      italic: "italic",
      underline: "underline",
      strikethrough: "line-through",
      code: "bg-gray-100 p-1 rounded font-mono text-sm",
    },
    // Classes for block types
    heading: {
      h1: "text-4xl font-extrabold mb-4 mt-6",
      h2: "text-3xl font-bold mb-3 mt-5",
      h3: "text-2xl font-semibold mb-2 mt-4",
    },
    quote: "border-l-4 border-blue-500 pl-4 py-2 italic text-gray-700 bg-blue-50/50", // Added subtle background
    list: {
      ul: "list-disc ml-8 my-2", 
      ol: "list-decimal ml-8 my-2",
    },
    link: "text-blue-600 hover:text-blue-800 underline transition-colors", 
    youtube: "flex justify-center my-6 p-2 rounded-lg bg-gray-50",
  },
  onError: (error) => {
    console.error(error);
  },
  nodes: [
    ParagraphNode,
    HeadingNode,
    QuoteNode,
    ListNode,
    ListItemNode,
    LinkNode,
    CodeNode,
    YouTubeNode,
  ],
};

// --- Helper function to get the currently selected node ---
function getSelectedNode(selection) {
  const anchorNode = selection.anchor.getNode();
  const focusNode = selection.focus.getNode();
  if (anchorNode === focusNode) {
    return anchorNode;
  }
  const isBackward = selection.isBackward();
  return isBackward ? anchorNode : focusNode;
}

// --- Improved Toolbar Component ---
const ToolbarPlugin = () => {
  const [editor] = useLexicalComposerContext();

  const [fontSize, setFontSize] = useState("16px");
  const [fontFamily, setFontFamily] = useState("Arial");
  const [blockType, setBlockType] = useState("paragraph");
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isCode, setIsCode] = useState(false);
  const [isLink, setIsLink] = useState(false);

  // FIX: Updated logic to correctly identify list type and block type.
  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsUnderline(selection.hasFormat("underline"));
      setIsStrikethrough(selection.hasFormat("strikethrough"));
      setIsCode(selection.hasFormat("code"));

      const node = getSelectedNode(selection);
      const parent = node.getParent();
      setIsLink($isLinkNode(parent) || $isLinkNode(node));

      const anchorNode = selection.anchor.getNode(); 
      let element = anchorNode.getTopLevelElementOrThrow();

      // Fix for List Type: Check if the top-level element is a list node
      if ($isListNode(element)) {
        // Find the nearest list item (parent of the anchor node)
        const nearestList = $getNearestNodeOfType(anchorNode, ListNode);
        if (nearestList) {
          setBlockType(nearestList.getListType()); // 'ul' or 'ol'
        }
      } 
      // Handle other block types
      else if ($isHeadingNode(element)) {
        setBlockType(element.getTag());
      } else if ($isQuoteNode(element)) {
        setBlockType("quote");
      } else {
        setBlockType("paragraph");
      }
    }
  }, []); 

  // Register listeners
  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbar();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          updateToolbar();
          return false;
        },
        0
      )
    );
  }, [editor, updateToolbar]);

  const formatText = (format) => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
  };

  const setAlignment = (alignment) => {
    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, alignment);
  };

  // FIX: List commands are now guaranteed to work correctly
  const formatBlock = (type) => {
    if (type === "ul" || type === "ol") {
      const command =
        type === "ul" ? INSERT_UNORDERED_LIST_COMMAND : INSERT_ORDERED_LIST_COMMAND;
      editor.dispatchCommand(command, undefined);
    } else {
      // Must remove list before setting block type to prevent nested errors
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined); 
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => {
            if (type.startsWith("h")) return $createHeadingNode(type);
            if (type === "quote") return $createQuoteNode();
            return $createParagraphNode();
          });
        }
      });
    }
  };

  const applyStyleText = (style, value) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        selection.setStyle(`${style}: ${value}`);
      }
    });
  };

  const onFontSizeSelect = (e) => {
    const size = e.target.value;
    setFontSize(size);
    applyStyleText("font-size", size);
  };

  const onFontFamilySelect = (e) => {
    const family = e.target.value;
    setFontFamily(family);
    applyStyleText("font-family", family);
  };

  const onBlockTypeSelect = (e) => {
    const type = e.target.value;
    setBlockType(type);
    formatBlock(type);
  };

  const insertLink = (isNofollow) => {
    let url = "https://";
    if (isLink) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    } else {
      url = window.prompt("Enter the URL:", url);
      if (!url) return;

      const payload = {
        url,
        target: "_blank",
        rel: isNofollow ? "nofollow" : "noopener noreferrer",
      };
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, payload);
    }
  };

  const insertYouTube = () => {
    const url = window.prompt("Enter YouTube URL:");
    if (!url) return;

    const videoIDMatch = url.match(
      /(?:\?v=|\/embed\/|\/youtu.be\/|\/v\/|\/watch\?v=)([^#\&\?]{11})/
    );
    const videoID = videoIDMatch ? videoIDMatch[1] : null;

    if (videoID) {
      editor.dispatchCommand(INSERT_YOUTUBE_COMMAND, videoID);
    } else {
      alert("Could not find a valid YouTube Video ID in that URL.");
    }
  };

  // Improved active class and button base style
  const activeClass = "bg-blue-500 text-white shadow-md"; 
  const defaultClass = "h-8 w-8 text-xl rounded transition-all duration-150 hover:bg-blue-100 hover:text-blue-700 text-gray-700";
  const linkActiveClass = "bg-green-100 text-green-700 hover:bg-green-200";

  return (
    <div className="toolbar p-2 border-x border-t border-gray-300 bg-white rounded-t-md flex flex-wrap gap-2 items-center shadow-inner">
      
      {/* 1. Block/Font Selection Group */}
      <div className="flex gap-2">
        <select
          onChange={onBlockTypeSelect}
          value={blockType}
          className="p-1.5 border border-gray-300 rounded text-sm text-gray-700 bg-gray-50 shadow-sm hover:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400 transition min-w-[130px]"
        >
          {Object.entries(BLOCK_TYPE_OPTIONS).map(([value, text]) => (
            <option key={value} value={value}>
              {text}
            </option>
          ))}
        </select>
      </div>

      <div className="border-l border-gray-300 h-6 self-center mx-1"></div>

      <div className="flex gap-2">
        <select
          onChange={onFontSizeSelect}
          value={fontSize}
          className="p-1.5 border border-gray-300 rounded text-sm text-gray-700 bg-gray-50 shadow-sm hover:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400 transition min-w-[100px]"
        >
          {FONT_SIZE_OPTIONS.map(([text, value]) => (
            <option key={value} value={value}>
              {text}
            </option>
          ))}
        </select>
        <select
          onChange={onFontFamilySelect}
          value={fontFamily}
          className="p-1.5 border border-gray-300 rounded text-sm text-gray-700 bg-gray-50 shadow-sm hover:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400 transition min-w-[150px]"
        >
          {FONT_FAMILY_OPTIONS.map(([text, value]) => (
            <option key={value} value={value}>
              {text}
            </option>
          ))}
        </select>
      </div>

      <div className="border-l border-gray-300 h-6 self-center mx-1"></div>

      {/* 2. Text Formatting Controls Group (B, I, U, S, Code) */}
      <div className="flex gap-1">
        <button
          onClick={() => formatText("bold")}
          className={`${defaultClass} text-lg font-bold ${isBold ? activeClass : ""}`}
          type="button"
          title="Bold (Ctrl+B)"
        >
          B
        </button>
        <button
          onClick={() => formatText("italic")}
          className={`${defaultClass} text-lg italic ${isItalic ? activeClass : ""}`}
          type="button"
          title="Italic (Ctrl+I)"
        >
          I
        </button>
        <button
          onClick={() => formatText("underline")}
          className={`${defaultClass} text-lg underline ${isUnderline ? activeClass : ""}`}
          type="button"
          title="Underline (Ctrl+U)"
        >
          U
        </button>
        <button
          onClick={() => formatText("strikethrough")}
          // Note: Keeping the unicode icon for strikethrough as it looks better than a single 'S'
          className={`${defaultClass} ${isStrikethrough ? activeClass : ""}`}
          type="button"
          title="Strikethrough"
        >
          <span className="text-xl">&#xe11a;</span> 
        </button>
        <button
          onClick={() => formatText("code")}
          className={`${defaultClass} ${isCode ? activeClass : ""}`}
          type="button"
          title="Code Format"
        >
          <span className="text-sm font-mono">{`</>`}</span>
        </button>
      </div>

      <div className="border-l border-gray-300 h-6 self-center mx-1"></div>
      
      {/* 3. Alignment Controls Group */}
      <div className="flex gap-1">
        <button
          onClick={() => setAlignment("left")}
          className={defaultClass}
          type="button"
          title="Align Left"
        >
          <span className="text-xl">L</span> 
        </button>
        <button
          onClick={() => setAlignment("center")}
          className={defaultClass}
          type="button"
          title="Align Center"
        >
          <span className="text-xl">C</span>
        </button>
        <button
          onClick={() => setAlignment("right")}
          className={defaultClass}
          type="button"
          title="Align Right"
        >
          <span className="text-xl">R</span> 
        </button>
      </div>

      <div className="border-l border-gray-300 h-6 self-center mx-1"></div>
      
      {/* 4. Link and Embed Controls Group */}
      <div className="flex gap-1">
        <button
          onClick={() => insertLink(false)}
          className={`px-3 py-1 rounded text-sm transition-colors ${
            isLink 
              ? linkActiveClass 
              : 'bg-white text-gray-700 hover:bg-gray-100'
          } border border-gray-300 shadow-sm`}
          type="button"
          title={isLink ? "Unlink" : "Insert Standard (DoFollow) Link"}
        >
          🔗 DoFollow
        </button>
        <button
          onClick={() => insertLink(true)}
          className={`px-3 py-1 rounded text-sm transition-colors bg-white text-gray-700 hover:bg-gray-100 border border-gray-300 shadow-sm`}
          type="button"
          title="Insert NoFollow Link"
        >
          🚫 NoFollow
        </button>
        <button
          onClick={insertYouTube}
          className="px-3 py-1 rounded text-sm transition-colors bg-white text-gray-700 hover:bg-gray-100 border border-gray-300 shadow-sm"
          type="button"
          title="Embed YouTube Video"
        >
          ▶️ Embed
        </button>
      </div>

      <div className="border-l border-gray-300 h-6 self-center mx-1"></div>

      {/* 5. History Controls Group */}
      <div className="flex gap-1">
        <button
          onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
          className="px-2 py-1 rounded text-sm hover:bg-gray-100 text-gray-700 border border-gray-300"
          type="button"
          title="Undo (Ctrl+Z)"
        >
          ↩️ Undo
        </button>
        <button
          onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
          className="px-2 py-1 rounded text-sm hover:bg-gray-100 text-gray-700 border border-gray-300"
          type="button"
          title="Redo (Ctrl+Y)"
        >
          ↪️ Redo
        </button>
      </div>
    </div>
  );
};

// --- The Main Editor Component ---
function GameDescriptionEditor({ onChange }) {
  const handleEditorChange = (editorState, editor) => {
    editorState.read(() => {
      const htmlString = $generateHtmlFromNodes(editor, null);
      onChange(htmlString);
    });
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <ToolbarPlugin />
      <div className="editor-container relative border-x border-b border-gray-300 rounded-b-md">
        <RichTextPlugin
          contentEditable={
            <ContentEditable
              className="editor-input outline-none" 
              style={editorStyle} 
            />
          }
          placeholder={
            <div
              className="editor-placeholder"
              style={{
                position: "absolute",
                top: "15px", 
                left: "20px",
                color: "#a0a0a0", 
                pointerEvents: "none",
                userSelect: "none",
              }}
            >
              **Write your detailed game description here...**
            </div>
          }
        />
      </div>

      <HistoryPlugin />
      <OnChangePlugin onChange={handleEditorChange} />
      <LexicalLinkPlugin />
      <YouTubePlugin />
    </LexicalComposer>
  );
}

export default GameDescriptionEditor;