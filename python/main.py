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
 
config = ConfigManager(CONFIG_SCHEMA)
config.load(r'python\test.json')

print(config.get('theme'))  # 'dark' (from file) or 'auto' (default)
config.set('theme', 'dark')  # Valid
config.set('theme', 'purple')  # Should raise ValueError

config.save(r'python\test.json')