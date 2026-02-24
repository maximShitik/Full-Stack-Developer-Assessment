import json
import pytest
from config_manager import ConfigManager


CONFIG_SCHEMA = {
    'theme': {
        'type': 'choice',
        'choices': ['light', 'dark', 'auto'],
        'default': 'auto'
    },
    'max_items': {
        'type': 'int',
        'default': 50
    },
    'enable_notifications': {
        'type': 'bool',
        'default': True
    },
    'api_endpoint': {
        'type': 'string',
        'default': 'https://api.example.com'
    }
}


def test_get_returns_schema_deafults_when_no_key():
    config = ConfigManager(CONFIG_SCHEMA)
    assert config.get("theme") == "auto"
    assert config.get("max_items") == 50


def test_set_invalid_choice_raises():
    config = ConfigManager(CONFIG_SCHEMA)
    with pytest.raises(ValueError):
        config.set("theme", "purple")


def test_load_unknown_key_raises(tmp_path):
    config = ConfigManager(CONFIG_SCHEMA)
    p = tmp_path / "config.json"
    p.write_text(json.dumps({"unknown_key": 123}), encoding="utf-8")
    with pytest.raises(ValueError):
        config.load(str(p))


def test_save_and_load_round_trip(tmp_path):
    
    config1 = ConfigManager(CONFIG_SCHEMA)
    config1.set("theme", "dark")
    config1.set("max_items", 120)

    path = tmp_path / "config.json"

    
    config1.save(str(path))

    
    config2 = ConfigManager(CONFIG_SCHEMA)
    config2.load(str(path))

    
    assert config2.get("theme") == "dark"
    assert config2.get("max_items") == 120

    
    assert config2.get("enable_notifications") is True
    assert config2.get("api_endpoint") == "https://api.example.com"