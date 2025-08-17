import React, { useEffect, useRef, useState } from "react";
import { Box } from "@chakra-ui/react";
import { Editor } from "@monaco-editor/react";
import LanguageSelector from "./LanguageSelector";
import { CODE_SNIPPETS } from "../constants";
import Output from "./Output";
import { debounce } from "lodash";
import { ACTIONS } from "../Actions";

export default function Ide({ socketRef, roomId, onCodeChange }) {
  const editorRef = useRef();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [value, setValue] = useState("");
  const [language, setLanguage] = useState("javascript");
  const isRemoteChange = useRef(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const debouncedEmitCodeChange = useRef(
    debounce((code) => {
      if (!isRemoteChange.current) {
        socketRef.current.emit(ACTIONS.CODE_CHANGE, {
          roomId,
          code,
        });
      }
    }, 300)
  ).current;

  const onMount = (editor) => {
    editorRef.current = editor;
    editor.focus();

    editor.onDidChangeModelContent(() => {
      const code = editor.getValue();
      if (code !== value && !isRemoteChange.current) {
        setValue(code);
        debouncedEmitCodeChange(code);
      }
    });
  };

  const onSelect = (language) => {
    setLanguage(language);
    setValue(CODE_SNIPPETS[language]);
    socketRef.current.emit(ACTIONS.LANGUAGE_CHANGE, {
      roomId,
      language,
    });
  };

  useEffect(() => {
    if (socketRef.current) {
      const handleCodeChange = ({ code }) => {
        if (
          editorRef.current &&
          code !== editorRef.current.getValue() &&
          code !== null
        ) {
          isRemoteChange.current = true;
          editorRef.current.setValue(code);
          isRemoteChange.current = false;
        }
      };

      const handleLanguageChange = ({ language }) => {
        if (
          editorRef.current &&
          language !== editorRef.current.getModel().getLanguageId()
        ) {
          editorRef.current.updateOptions({ language });
          setLanguage(language);
        }
      };

      socketRef.current.on(ACTIONS.CODE_CHANGE, handleCodeChange);
      socketRef.current.on(ACTIONS.LANGUAGE_CHANGE, handleLanguageChange);

      return () => {
        socketRef.current.off(ACTIONS.CODE_CHANGE, handleCodeChange);
        socketRef.current.off(ACTIONS.LANGUAGE_CHANGE, handleLanguageChange);
      };
    }
  }, [socketRef.current]);

  return (
    <div className="h-screen w-full flex flex-col bg-gray-950 text-gray-100 p-4">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold bg-gradient-to-r from-green-400 to-teal-400 bg-clip-text text-transparent">
          CollabCode IDE
        </h2>
        <LanguageSelector
          language={language}
          onSelect={onSelect}
          value={value}
          setValue={setValue}
        />
      </div>

      {/* Main container */}
      <Box className="flex flex-col lg:flex-row gap-4 flex-grow overflow-hidden">
        {/* Editor Section */}
        <div className="flex-1 bg-gray-900 rounded-xl shadow-lg border border-gray-700 overflow-hidden">
          <Editor
            options={{
              minimap: { enabled: false },
              smoothScrolling: true,
              scrollBeyondLastLine: false,
              fontSize: 14,
              lineNumbers: "on",
            }}
            height="100%"
            width="100%"
            theme="vs-dark"
            language={language}
            defaultValue={CODE_SNIPPETS[language]}
            onMount={onMount}
            value={value}
            onChange={(value) => setValue(value)}
          />
        </div>

        {/* Output Section */}
        <div className="lg:w-1/3 w-full bg-gray-900 rounded-xl shadow-lg border border-gray-700 p-3">
          <Output
            editorRef={editorRef}
            language={language}
            socketRef={socketRef}
            roomId={roomId}
          />
        </div>
      </Box>
    </div>
  );
}
