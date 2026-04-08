import random

# --- Constants ---
BLOCK_SIZE = 8
NUM_ROUNDS = 4
PAD_CHAR = "~"

# Updated Character Set to include Base64 characters (+, /, =)
CHARACTER_SET = list(
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    "abcdefghijklmnopqrstuvwxyz"
    "0123456789"
    " !\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~"
)
CHAR_SET_SIZE = len(CHARACTER_SET)
CHAR_TO_INDEX = {char: i for i, char in enumerate(CHARACTER_SET)}
INDEX_TO_CHAR = {i: char for i, char in enumerate(CHARACTER_SET)}


def generate_s_box(char_set):
    shuffled_set = char_set[:]
    random.seed(42)
    random.shuffle(shuffled_set)
    s_box = {char_set[i]: shuffled_set[i] for i in range(len(char_set))}
    inverse_s_box = {v: k for k, v in s_box.items()}
    return s_box, inverse_s_box


S_BOX, INVERSE_S_BOX = generate_s_box(CHARACTER_SET)
P_BOX = [4, 7, 1, 6, 3, 0, 5, 2]
INVERSE_P_BOX = [5, 2, 7, 4, 0, 6, 3, 1]


# --- Helper Functions ---
def mix_with_key(block, key):
    mixed_block = ""
    for i in range(len(block)):
        new_idx = (CHAR_TO_INDEX[block[i]] + CHAR_TO_INDEX[key[i]]) % CHAR_SET_SIZE
        mixed_block += INDEX_TO_CHAR[new_idx]
    return mixed_block


def unmix_with_key(block, key):
    unmixed_block = ""
    for i in range(len(block)):
        new_idx = (
            CHAR_TO_INDEX[block[i]] - CHAR_TO_INDEX[key[i]] + CHAR_SET_SIZE
        ) % CHAR_SET_SIZE
        unmixed_block += INDEX_TO_CHAR[new_idx]
    return unmixed_block


def substitute(input_block, s_box):
    return "".join(s_box.get(char, char) for char in input_block)


def permute(input_block, p_box):
    output_block_list = [""] * BLOCK_SIZE
    for i in range(BLOCK_SIZE):
        output_block_list[p_box[i]] = input_block[i]
    return "".join(output_block_list)


def pad(text):
    padding_needed = BLOCK_SIZE - (len(text) % BLOCK_SIZE)
    if padding_needed == BLOCK_SIZE:
        return text
    return text + PAD_CHAR * padding_needed


# --- Main Logic ---
def encrypt(plaintext, master_key):
    padded_plaintext = pad(plaintext)
    # Simple key schedule: cyclic shift
    round_keys = [master_key]
    curr_k = master_key
    for _ in range(NUM_ROUNDS):
        curr_k = curr_k[1:] + curr_k[0]
        round_keys.append(curr_k)

    ciphertext = ""
    blocks = [
        padded_plaintext[i : i + BLOCK_SIZE]
        for i in range(0, len(padded_plaintext), BLOCK_SIZE)
    ]
    for block in blocks:
        current_data = mix_with_key(block, round_keys[0])
        for r in range(NUM_ROUNDS):
            current_data = substitute(current_data, S_BOX)
            current_data = permute(current_data, P_BOX)
            current_data = mix_with_key(current_data, round_keys[r + 1])
        ciphertext += current_data
    return ciphertext


def decrypt(ciphertext, master_key):
    round_keys = [master_key]
    curr_k = master_key
    for _ in range(NUM_ROUNDS):
        curr_k = curr_k[1:] + curr_k[0]
        round_keys.append(curr_k)

    decrypted_padded_text = ""
    blocks = [ciphertext[i : i + BLOCK_SIZE] for i in range(0, len(ciphertext), BLOCK_SIZE)]
    for block in blocks:
        current_data = block
        for r in range(NUM_ROUNDS, 0, -1):
            current_data = unmix_with_key(current_data, round_keys[r])
            current_data = permute(current_data, INVERSE_P_BOX)
            current_data = substitute(current_data, INVERSE_S_BOX)
        current_data = unmix_with_key(current_data, round_keys[0])
        decrypted_padded_text += current_data
    return decrypted_padded_text.rstrip(PAD_CHAR)
import random

# --- Constants ---
BLOCK_SIZE = 8
NUM_ROUNDS = 4
PAD_CHAR = '~'

# Updated Character Set to include Base64 characters (+, /, =)
CHARACTER_SET = list(
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    "abcdefghijklmnopqrstuvwxyz"
    "0123456789"
    " !\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~"
)
CHAR_SET_SIZE = len(CHARACTER_SET)
CHAR_TO_INDEX = {char: i for i, char in enumerate(CHARACTER_SET)}
INDEX_TO_CHAR = {i: char for i, char in enumerate(CHARACTER_SET)}

def generate_s_box(char_set):
    shuffled_set = char_set[:]
    random.seed(42) 
    random.shuffle(shuffled_set)
    s_box = {char_set[i]: shuffled_set[i] for i in range(len(char_set))}
    inverse_s_box = {v: k for k, v in s_box.items()}
    return s_box, inverse_s_box

S_BOX, INVERSE_S_BOX = generate_s_box(CHARACTER_SET)
P_BOX = [4, 7, 1, 6, 3, 0, 5, 2]
INVERSE_P_BOX = [5, 2, 7, 4, 0, 6, 3, 1]

# --- Helper Functions ---
def mix_with_key(block, key):
    mixed_block = ""
    for i in range(len(block)):
        new_idx = (CHAR_TO_INDEX[block[i]] + CHAR_TO_INDEX[key[i]]) % CHAR_SET_SIZE
        mixed_block += INDEX_TO_CHAR[new_idx]
    return mixed_block

def unmix_with_key(block, key):
    unmixed_block = ""
    for i in range(len(block)):
        new_idx = (CHAR_TO_INDEX[block[i]] - CHAR_TO_INDEX[key[i]] + CHAR_SET_SIZE) % CHAR_SET_SIZE
        unmixed_block += INDEX_TO_CHAR[new_idx]
    return unmixed_block

def substitute(input_block, s_box):
    return ''.join(s_box.get(char, char) for char in input_block)

def permute(input_block, p_box):
    output_block_list = [''] * BLOCK_SIZE
    for i in range(BLOCK_SIZE):
        output_block_list[p_box[i]] = input_block[i]
    return ''.join(output_block_list)

def pad(text):
    padding_needed = BLOCK_SIZE - (len(text) % BLOCK_SIZE)
    if padding_needed == BLOCK_SIZE: return text
    return text + PAD_CHAR * padding_needed

# --- Main Logic ---
def encrypt(plaintext, master_key):
    padded_plaintext = pad(plaintext)
    # Simple key schedule: cyclic shift
    round_keys = [master_key]
    curr_k = master_key
    for _ in range(NUM_ROUNDS):
        curr_k = curr_k[1:] + curr_k[0]
        round_keys.append(curr_k)

    ciphertext = ""
    blocks = [padded_plaintext[i:i+BLOCK_SIZE] for i in range(0, len(padded_plaintext), BLOCK_SIZE)]
    for block in blocks:
        current_data = mix_with_key(block, round_keys[0])
        for r in range(NUM_ROUNDS):
            current_data = substitute(current_data, S_BOX)
            current_data = permute(current_data, P_BOX)
            current_data = mix_with_key(current_data, round_keys[r+1])
        ciphertext += current_data
    return ciphertext

def decrypt(ciphertext, master_key):
    round_keys = [master_key]
    curr_k = master_key
    for _ in range(NUM_ROUNDS):
        curr_k = curr_k[1:] + curr_k[0]
        round_keys.append(curr_k)

    decrypted_padded_text = ""
    blocks = [ciphertext[i:i+BLOCK_SIZE] for i in range(0, len(ciphertext), BLOCK_SIZE)]
    for block in blocks:
        current_data = block
        for r in range(NUM_ROUNDS, 0, -1):
            current_data = unmix_with_key(current_data, round_keys[r])
            current_data = permute(current_data, INVERSE_P_BOX)
            current_data = substitute(current_data, INVERSE_S_BOX)
        current_data = unmix_with_key(current_data, round_keys[0])
        decrypted_padded_text += current_data
    return decrypted_padded_text.rstrip(PAD_CHAR)