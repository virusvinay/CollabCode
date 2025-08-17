// import { useState } from "react";
// import { Box, Button, Flex, Text, useToast } from "@chakra-ui/react";
// import { executeCode } from "../api";
// import { ACTIONS } from "../Actions";
// import { useEffect } from "react";
// const Output = ({ editorRef, language, socketRef, roomId }) => {
//   //console.log("top p hai bhai" , editorRef.current.getValue())
//   const toast = useToast();
//   const [output, setOutput] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isError, setIsError] = useState(false);

//   const runCode = async () => {
//     const sourceCode = editorRef.current.getValue();
   
//     if (!sourceCode) return;
//     try {
//       setIsLoading(true);
//       const { run: result } = await executeCode(language, sourceCode);
//       console.log("res" , result.output.split("\n"))
//       setOutput(result.output.split("\n"));
//       console.log("upar" , output)
//       //editorRef.current.setValue(output);
//       result.stderr ? setIsError(true) : setIsError(false);

//        // Emit the output to all clients
//      //  console.log("output kya aaya" , socketRef.current.emit)
//       //  socketRef.current.emit(ACTIONS.CODE_OUTPUT, {
//       //   roomId,
//       //   output,
//       //    error: result.stderr,
//       // });

//       if(socketRef.current){
//         console.log("andar" , output)
//       socketRef.current.emit('sendApiData', {
//         roomId,
//         output:result.output.split("\n"),
//         error : result.stderr
//       });
//       }
//     } catch (error) {
//       console.log(error);
//       toast({
//         title: "An error occurred.",
//         description: error.message || "Unable to run code",
//         status: "error",
//         duration: 6000,
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };



//   useEffect(() => {
//     if(socketRef.current){
//     socketRef.current.on('sendApiData', ({output,error}) => {
//       console.log('Received data from server:', output);
//       // Update UI or state with the received data
//       setOutput(output)
//       {error ? setIsError(true) : setIsError(false)}
//     });
//   }

//   return () => {
//     socketRef.current.off('sendApiData');
   
//   };

//   }, [socketRef.current , output]);

//   return (
//     <Box w="50%" h="auto" >
//     <Box className="p-4 ">
//       <Text mb={2} fontSize="lg">
//         Output
//       </Text>
//       <Button
//         variant="outline"
//         colorScheme="green"
//         mb={4}
//         isLoading={isLoading}
//         onClick={runCode}
//       >
//         Run Code
//       </Button>
//       <Box className="border border-success"
//         height="75vh"
//         p={2}
//         color={isError ? "red.400" : ""}
//         border="1px solid"
//         borderRadius={4}
//         borderColor={isError ? "red.500" : "#333"}
//       >
//         {output
//           ? output.map((line, i) => <Text key={i}>{line}</Text>)
//           : 'Click "Run Code" to see the output here'}
//       </Box>
//       </Box>
     
//     </Box>
    
//   );
// };
// export default Output;



















import React, { useState, useEffect } from "react";
import { Box, Button, Text, useToast } from "@chakra-ui/react";
import { executeCode } from "../api";
import { ACTIONS } from "../Actions";

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
        socketRef.current.emit('sendApiData', {
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
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on('sendApiData', ({ output, error }) => {
        setOutput(output);
        setIsError(error ? true : false);
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.off('sendApiData');
      }
    };
  }, [socketRef.current]);

  return (
    <Box className="p-4 w-full lg:w-1/2 mx-auto">
      <Text mb={2} fontSize="lg" fontWeight="bold" color="gray-700">
        Output
      </Text>
      <Button
        variant="outline"
        colorScheme="green"
        mb={4}
        isLoading={isLoading}
        onClick={runCode}
        className="transition-transform transform hover:scale-105"
      >
        Run Code
      </Button>
      <Box
        className={`border p-2 rounded-lg overflow-auto h-80 ${isError ? 'border-red-500 text-red-500' : 'border-gray-300'}`}
      >
        {output
          ? output.map((line, i) => <Text key={i}>{line}</Text>)
          : 'Click "Run Code" to see the output here'}
      </Box>
    </Box>
  );
};

export default Output;
