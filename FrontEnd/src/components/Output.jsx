import React, { useState, useEffect } from "react";
import { Box, Button, Text, useToast } from "@chakra-ui/react";
import { executeCode } from "../api";

const Output = ({ editorRef, language, socketRef, roomId }) => {
  const toast = useToast();
  const [output, setOutput] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const runCode = async () => {
    const sourceCode = editorRef.current.getValue();
    if (!sourceCode) return;

    try {
      setIsLoading(true);
      const { run: result } = await executeCode(language, sourceCode);
      setOutput(result.output.split("\n"));
      setIsError(result.stderr ? true : false);

      if (socketRef.current) {
        socketRef.current.emit("sendApiData", {
          roomId,
          output: result.output.split("\n"),
          error: result.stderr,
        });
      }
    } catch (error) {
      toast({
        title: "An error occurred.",
        description: error.message || "Unable to run code",
        status: "error",
        duration: 6000,
        isClosable: true,
        position: "top-right",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on("sendApiData", ({ output, error }) => {
        setOutput(output);
        setIsError(error ? true : false);
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.off("sendApiData");
      }
    };
  }, [socketRef.current]);

  return (
    <Box
      className="flex flex-col h-full w-full rounded-xl shadow-lg bg-gray-900 border border-gray-700"
    >
      {/* Header with Run button */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-700">
        <Text fontSize="lg" fontWeight="bold" className="text-orange-400">
          ⚡ Output
        </Text>
        <Button
          size="sm"
          colorScheme="green"
          isLoading={isLoading}
          onClick={runCode}
          className="transition-transform transform hover:scale-105"
        >
          Run
        </Button>
      </div>

      {/* Scrollable output */}
      <Box
        className={`flex-1 p-3 overflow-auto text-sm font-mono transition-all ${
          isError
            ? "bg-red-900/40 text-red-400"
            : "bg-gray-950 text-green-300"
        }`}
      >
        {output ? (
          output.map((line, i) => (
            <Text key={i} className="whitespace-pre-wrap">
              {line}
            </Text>
          ))
        ) : (
          <Text className="text-gray-500 italic">
            💡 Click "Run" to see the output here
          </Text>
        )}
      </Box>
    </Box>
  );
};

export default Output;
