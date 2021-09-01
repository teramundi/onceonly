import unittest
import urllib.parse

from app.services import RandomPasswdGenerator


class TestRandomPasswdGenerator(unittest.TestCase):

    def test_random_string_length(self):
        size = 6
        generator = RandomPasswdGenerator(size=size)
        random_str = generator.generate()
        
        self.assertEqual(len(random_str), size)

    
    def test_url_safe_chars(self):
        generator = RandomPasswdGenerator(20)
        random_str = generator.generate()
        quoted_str = urllib.parse.quote(random_str)
        
        self.assertEqual(random_str, quoted_str)

        chars = RandomPasswdGenerator.CHARS
        quoted_chars = urllib.parse.quote(chars)

        self.assertEqual(chars, quoted_chars)