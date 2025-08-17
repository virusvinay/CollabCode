import {
  Box,
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import { LANGUAGE_VERSIONS } from "../constants";
import { IoCopy } from "react-icons/io5";
import { toast } from "react-hot-toast";
const languages = Object.entries(LANGUAGE_VERSIONS);
const ACTIVE_COLOR = "blue.400";

const LanguageSelector = ({ language, onSelect , value, setValue }) => {

  const copyHandler = async () => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success(`Code copied to clipboard`);
    
    } catch (error) {
      console.log(error);
      toast.error("Unable to copy the Code");
    }
  };
  return (
    <Box ml={2} mb={4} className="flex  flex-col justify-center sm:items-start items-center " >
      <Text mb={2} fontSize="lg">
        Choose Language:
      </Text>
      <div className="flex gap-x-5 items-center">

     
      <Menu isLazy>
        <MenuButton as={Button}>{language}</MenuButton>
        <MenuList bg="#110c1b">
          {languages.map(([lang, version]) => (
            <MenuItem
              key={lang}
              color={lang === language ? ACTIVE_COLOR : ""}
              bg={lang === language ? "gray.900" : "transparent"}
              _hover={{
                color: ACTIVE_COLOR,
                bg: "gray.900",
              }}
              onClick={() => onSelect(lang)}
            >
              {lang}
              &nbsp;
              <Text as="span" color="gray.600" fontSize="sm">
                ({version})
              </Text>
            </MenuItem>
          ))}
        </MenuList>
      
      </Menu>
      <div className=" text-2xl text-yellow-400 font-extrabold cursor-pointer  " onClick={copyHandler}>

     
      <IoCopy />
      </div>
      </div>
    </Box>
  );
};
export default LanguageSelector;
