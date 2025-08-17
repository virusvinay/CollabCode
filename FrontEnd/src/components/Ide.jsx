

import React, { useEffect, useRef, useState } from "react";
import { Box, HStack } from "@chakra-ui/react";
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
  const isRemoteChange = useRef(false); // Flag to track remote changes

  useEffect(() => {
    // Handler to update the state based on window size
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // Adjust breakpoint as needed
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const debouncedEmitCodeChange = useRef(
    debounce((code) => {
      console.log("haan bhai deboune me hun");
      if (!isRemoteChange.current) {
           console.log("haan bhai deboune ke v andar hun");
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
             console.log("changes1" , code , value);
      if (code !== value && !isRemoteChange.current) {
        console.log("changes2" , code , value);
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
           console.log("Received Code:", code);
          console.log("Current Editor Value:", editorRef.current.getValue());
        if (editorRef.current && code !== editorRef.current.getValue() && code!==null) {
          isRemoteChange.current = true; // Mark change as remote
          editorRef.current.setValue(code);
         // setValue(code);
          isRemoteChange.current = false; // Reset the flag after change
        }
         console.log("Updated Editor Value:", editorRef.current.getValue());
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
    <div className="p-4 h-screen bg-gray-900 text-gray-100">
      <Box className="p-3 border rounded bg-gray-800 max-sm:h-[1000px] flex flex-col lg:flex-row items-center ">
        <div className="flex flex-col flex-grow lg:w-3/4 sm:w-full ">
          <LanguageSelector language={language} onSelect={onSelect} value={value} setValue={setValue} />
          <Editor
            options={{
              minimap: { enabled: false },
              smoothScrolling: true,
              scrollBeyondLastLine: false,
            }}
            height="75vh"
            width={isMobile ? "100vw" : "45vw"}
            theme="vs-dark"
            language={language}
            defaultValue={CODE_SNIPPETS[language]}
            onMount={onMount}
            value={value}
            onChange={(value) => setValue(value)}
            className="border rounded p-2"
          />
        </div>
        <Output
          editorRef={editorRef}
          language={language}
          socketRef={socketRef}
          roomId={roomId}
          className="rounded p-3 w-full lg:w-1/3 mt-4 lg:mt-0"
        />
      </Box>
    </div>
  );
}









