import json



class ConfigManager():
    def __init__(self,schema):
        self.schema = schema
        self.values = {}

        


    def load(self,filepath: str)-> None:
        """
        @brief Load configuration from a JSON file and validate it against the schema.

        @details
        - If the file does not exist, the method returns gracefully and keeps defaults.
        - The loaded JSON must be a dictionary.
        - Each key must exist in the schema.
        - Each value is validated according to its declared type.
        - If validation fails, a ValueError is raised.
        """
        try:
           with open(filepath,"r") as file:
               data = json.load(file)
        except FileNotFoundError:
           return
        if not isinstance(data, dict):
            raise ValueError("Invalid config file: expected a JSON object (dictionary) at the top level")

        new_values = {}
        for key, value in data.items():
            self._key_in_schema(key)
            self._value_validate(key,value)
            new_values[key] = value
        
        self.values = new_values


    def save(self,filepath: str)-> None:
        all_values = self.get_all()

        # saves the curerent config to the file
        with open(filepath, "w", encoding="utf-8") as file:
            json.dump(all_values, file, ensure_ascii=False, indent=2)



    def get(self,key: str, default=None)-> None:
        self._key_in_schema(key)

        if key in self.values:
            return self.values[key]
        
        if default is not None:
            return default
        
        return self._schema_default(key)
           



    def set(self,key: str, value)-> None:
        self._key_in_schema(key)
        self._value_validate(key,value)
        self.values[key] = value


    def get_all(self)->dict[str,any]:
        """
        @brief Return a complete configuration dictionary.

        @details
        Ensures all schema keys are included.
        If a key was not explicitly set, its schema default is returned.
        """
        result = {}
        for key in self.schema.keys():
            if key in self.values.keys():
                result[key] = self.values[key]
            else:
                result[key] = self._schema_default(key)
        return result

    def reset(self,key: str)-> None:
        self._key_in_schema(key)
        self.values[key] = self._schema_default(key)




    # Helper functions 

    def _key_in_schema(self,key: str)-> None:
        if key not in self.schema:
            raise ValueError(f"Unknown configuration key: '{key}'")
        

    def _schema_default(self,key: str)-> None:
        schema_key = self.schema.get(key,{})
        return schema_key.get("default",None)



    # validates the value type
    def _value_validate(self, key: str, value)-> None:
        """
        @brief Validate a value according to the schema definition.

        @details
        Supported types:
        - bool   → must be strictly True/False
        - string → must be str
        - int    → must be int (bool is explicitly rejected)
        - choice → value must be in the allowed 'choices' list

        Raises ValueError with descriptive messages on invalid input.
        """
        setting_key = self.schema[key]
        setting_type = setting_key.get("type")

        if setting_type == "bool" :
            if not isinstance(value,bool):
             raise ValueError( f"Invalid value for '{key}': expected boolean, got {type(value).__name__}")

        elif setting_type == "string":
            if not isinstance(value,str):
                raise ValueError( f"Invalid value for '{key}': expected string, got {type(value).__name__}")
        
        elif setting_type == 'int':
            if isinstance(value, bool) or not isinstance(value, int):
                raise ValueError( f"Invalid value for '{key}': expected int, got {type(value).__name__}")
        
        elif setting_type == "choice":
            choices = setting_key.get("choices")


            if value not in choices:
                raise ValueError(f"Invalid value for '{key}': expected one of {choices}, got {value!r}")
            
        else:
            raise ValueError(
                f"Invalid schema for '{key}': unknown type {setting_type!r}. "
                "Supported: 'bool', 'string', 'int', 'choice'.")