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


CONFIG_SCHEMA_2 = {
    "environment": {"type": "choice", "choices": ["dev", "staging", "prod"], "default": "dev"},
    "retry_count": {"type": "int", "default": 3},
    "debug_mode": {"type": "bool", "default": False},
    "service_name": {"type": "string", "default": "doc-processor"},
    "log_level": {"type": "choice", "choices": ["DEBUG", "INFO", "WARNING", "ERROR"], "default": "INFO"},
    "timeout_seconds": {"type": "int", "default": 30},
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






def test_set_unknown_key_raises():
    config = ConfigManager(CONFIG_SCHEMA_2)
    with pytest.raises(ValueError):
        config.set("unknown_key", 1)


def test_set_wrong_type_bool_raises():
    config = ConfigManager(CONFIG_SCHEMA_2)
    with pytest.raises(ValueError):
        config.set("debug_mode", "true")  # must be bool, not string


def test_set_wrong_type_int_raises():
    config = ConfigManager(CONFIG_SCHEMA_2)
    with pytest.raises(ValueError):
        config.set("retry_count", 2.5)  # must be int, not float


def test_set_wrong_type_string_raises():
    config = ConfigManager(CONFIG_SCHEMA_2)
    with pytest.raises(ValueError):
        config.set("service_name", 123)  # must be string


def test_choice_validation_raises_for_invalid_value():
    config = ConfigManager(CONFIG_SCHEMA_2)
    with pytest.raises(ValueError):
        config.set("environment", "production")  # not in ["dev","staging","prod"]


def test_get_all_contains_defaults_and_overrides():
    config = ConfigManager(CONFIG_SCHEMA_2)
    config.set("environment", "prod")
    config.set("retry_count", 10)

    all_cfg = config.get_all()
    assert all_cfg["environment"] == "prod"
    assert all_cfg["retry_count"] == 10

    # defaults that were not set explicitly
    assert all_cfg["debug_mode"] is False
    assert all_cfg["service_name"] == "doc-processor"
    assert all_cfg["log_level"] == "INFO"


def test_load_file_not_found_uses_defaults(tmp_path):
    # intentionally do NOT create the file
    missing = tmp_path / "missing.json"
    config = ConfigManager(CONFIG_SCHEMA_2)

    # should not raise; should fallback to defaults
    config.load(str(missing))

    assert config.get("environment") == "dev"
    assert config.get("retry_count") == 3
    assert config.get("debug_mode") is False


def test_reset_sets_value_back_to_default(tmp_path):
    config = ConfigManager(CONFIG_SCHEMA_2)
    config.set("timeout_seconds", 99)
    assert config.get("timeout_seconds") == 99

    # bonus method
    config.reset("timeout_seconds")
    assert config.get("timeout_seconds") == 30


def test_reset_unknown_key_raises():
    config = ConfigManager(CONFIG_SCHEMA_2)
    with pytest.raises(ValueError):
        config.reset("not_in_schema")


def test_load_invalid_type_in_file_raises(tmp_path):
    config = ConfigManager(CONFIG_SCHEMA_2)
    p = tmp_path / "config.json"

    # retry_count must be int; here it is string -> should raise
    p.write_text(json.dumps({"retry_count": "3"}), encoding="utf-8")
    with pytest.raises(ValueError):
        config.load(str(p))


def test_load_allows_partial_file_and_uses_defaults_for_missing(tmp_path):
    config = ConfigManager(CONFIG_SCHEMA_2)
    p = tmp_path / "config.json"

    # only set 1 key
    p.write_text(json.dumps({"log_level": "ERROR"}), encoding="utf-8")
    config.load(str(p))

    assert config.get("log_level") == "ERROR"
    # missing keys should still be defaults
    assert config.get("environment") == "dev"
    assert config.get("retry_count") == 3
