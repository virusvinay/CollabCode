// import { Box } from "@chakra-ui/react";
// import CodeEditor from "./components/CodeEditor";
// import Home from "./components/Home";
// import { Routes } from "react-router-dom";
// import { Route } from "react-router-dom";
// import { Toaster } from "react-hot-toast";
// import Navbar from "./components/Navbar";
// function App() {
//   return (
   
//     <Box color="gray.500" className="w-100 " >
//      <Navbar></Navbar>
//      <Toaster></Toaster>
//     <Routes>
//            <Route path="/" element = {<Home></Home>}> </Route>
//            <Route path="/Editor/:roomId" element={<CodeEditor></CodeEditor>}></Route>
//     </Routes>
   
//       {/* <CodeEditor /> */}
//     </Box>
//   );
// }

// export default App;


// import { Box } from "@chakra-ui/react";
// import CodeEditor from "./components/CodeEditor";
// import Home from "./components/Home";
// import { Routes, Route } from "react-router-dom";
// import { Toaster } from "react-hot-toast";
// import Navbar from "./components/Navbar";

// function App() {
//   return (
//     <Box className="w-full min-h-screen bg-gray-100 text-gray-800">
//       <Navbar />
//       <Toaster />
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/Editor/:roomId" element={<CodeEditor />} />
//       </Routes>
//     </Box>
//   );
// }

// export default App;


import { Box } from "@chakra-ui/react";
import CodeEditor from "./components/CodeEditor";
import Home from "./components/Home";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";

function App() {
  return (
    <Box className="w-full min-h-screen bg-gray-100 text-gray-800 ">
      <Navbar />
      <Toaster />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Editor/:roomId" element={<CodeEditor />} />
      </Routes>
    </Box>
  );
}

export default App;

