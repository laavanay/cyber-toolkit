import itertools
import re
from typing import List, Set

class WordlistEngine:
    def __init__(self):
        self.leet_map = {
            'a': ['a', '4', '@'],
            'e': ['e', '3'],
            'i': ['i', '1', '!'],
            'o': ['o', '0'],
            's': ['s', '5', '$'],
            't': ['t', '7'],
            'b': ['b', '8'],
            'g': ['g', '9']
        }

    def generate_base_combinations(self, user_info: dict) -> Set[str]:
        words = []
        if user_info.get('first_name'): words.append(user_info['first_name'].lower())
        if user_info.get('last_name'): words.append(user_info['last_name'].lower())
        if user_info.get('nickname'): words.append(user_info['nickname'].lower())
        if user_info.get('pet_name'): words.append(user_info['pet_name'].lower())
        if user_info.get('email_username'): words.append(user_info['email_username'].lower())
        
        common_words = user_info.get('common_words', [])
        words.extend([w.lower() for w in common_words])

        favorites = user_info.get('favorite_numbers', [])
        birthdate = user_info.get('birthdate', '') # Expected YYYY-MM-DD
        years = []
        if birthdate and len(birthdate) >= 4:
            year = birthdate[:4]
            years.append(year)
            years.append(year[2:]) # last 2 digits

        suffixes = ['123', '!', '@', '#', '123!', '2024', '2025']
        suffixes.extend(favorites)
        suffixes.extend(years)

        combinations = set()

        # Basic words
        for word in words:
            combinations.add(word)
            # Word + Suffix
            for suffix in suffixes:
                combinations.add(f"{word}{suffix}")
                combinations.add(f"{word}_{suffix}")
                combinations.add(f"{word}@{suffix}")
                combinations.add(f"{word}{suffix}!")

        # Capitalization
        capitalized = set()
        for cmd in combinations:
            if len(cmd) > 0:
                capitalized.add(cmd.capitalize())
                capitalized.add(cmd.upper())
        
        combinations.update(capitalized)
        return combinations

    def apply_mutations(self, wordlist: Set[str]) -> Set[str]:
        mutated = set(wordlist)
        for word in list(wordlist):
            # Simple l33t mutations (non-recursive for performance in this demo)
            leet_word = word
            for char, subs in self.leet_map.items():
                if char in leet_word:
                    leet_word = leet_word.replace(char, subs[1]) # Pick one sub
            mutated.add(leet_word)
        return mutated

    def get_wordlist(self, user_info: dict) -> List[str]:
        base = self.generate_base_combinations(user_info)
        final = self.apply_mutations(base)
        return sorted(list(final))
