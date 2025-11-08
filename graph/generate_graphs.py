import json
import matplotlib.pyplot as plt
import pandas as pd
import numpy as np

# Load your JSON data
with open('./data.json', 'r') as f:
    data = json.load(f)

# Set up professional styling
plt.style.use('seaborn-v0_8')
fig, axes = plt.subplots(2, 2, figsize=(15, 12))
fig.suptitle('Cryptographic Operations Performance Analysis', fontsize=16, fontweight='bold')

# 1. AES Performance Graph (Encryption)
ax1 = axes[0, 0]
aes_data = data['aes_performance']['encryption']

for config_name, measurements in aes_data.items():
    sizes = [m['size'] for m in measurements]
    times = [m['time'] for m in measurements]
    label = f"AES-{measurements[0]['keySize']} {measurements[0]['mode']}"
    ax1.plot(sizes, times, marker='o', linewidth=2, markersize=4, label=label)

ax1.set_xlabel('File Size (bytes)')
ax1.set_ylabel('Time (seconds)')
ax1.set_title('AES Encryption Performance')
ax1.legend()
ax1.grid(True, alpha=0.3)
ax1.set_xscale('log')

# 2. SHA-256 Performance Graph
ax2 = axes[0, 1]
sha_data = data['sha256_performance']

sizes = [m['size'] for m in sha_data]
times = [m['time'] for m in sha_data]

ax2.plot(sizes, times, marker='s', color='red', linewidth=2, markersize=6, label='SHA-256')
ax2.set_xlabel('File Size (bytes)')
ax2.set_ylabel('Time (seconds)')
ax2.set_title('SHA-256 Hashing Performance')
ax2.legend()
ax2.grid(True, alpha=0.3)
ax2.set_xscale('log')

# 3. RSA Encryption/Decryption Performance
ax3 = axes[1, 0]
rsa_enc = data['rsa_performance']['encryption']
rsa_dec = data['rsa_performance']['decryption']

key_sizes = [m['keySize'] for m in rsa_enc]
enc_times = [m['time'] for m in rsa_enc]
dec_times = [m['time'] for m in rsa_dec]

bar_width = 0.35
x_indexes = np.arange(len(key_sizes))

ax3.bar(x_indexes - bar_width/2, enc_times, bar_width, label='RSA Encryption', alpha=0.8)
ax3.bar(x_indexes + bar_width/2, dec_times, bar_width, label='RSA Decryption', alpha=0.8)

ax3.set_xlabel('RSA Key Size (bits)')
ax3.set_ylabel('Time (seconds)')
ax3.set_title('RSA Encryption/Decryption Performance')
ax3.set_xticks(x_indexes)
ax3.set_xticklabels(key_sizes)
ax3.legend()
ax3.grid(True, alpha=0.3)

# 4. RSA Signature Performance
ax4 = axes[1, 1]
rsa_sign = data['rsa_performance']['signature']
rsa_verify = data['rsa_performance']['verification']

key_sizes_sig = [m['keySize'] for m in rsa_sign]
sign_times = [m['time'] for m in rsa_sign]
verify_times = [m['time'] for m in rsa_verify]

x_indexes_sig = np.arange(len(key_sizes_sig))

ax4.bar(x_indexes_sig - bar_width/2, sign_times, bar_width, label='RSA Sign', alpha=0.8)
ax4.bar(x_indexes_sig + bar_width/2, verify_times, bar_width, label='RSA Verify', alpha=0.8)

ax4.set_xlabel('RSA Key Size (bits)')
ax4.set_ylabel('Time (seconds)')
ax4.set_title('RSA Digital Signature Performance')
ax4.set_xticks(x_indexes_sig)
ax4.set_xticklabels(key_sizes_sig)
ax4.legend()
ax4.grid(True, alpha=0.3)

# Adjust layout and save
plt.tight_layout()
plt.savefig('crypto_performance_analysis.png', dpi=300, bbox_inches='tight')
plt.show()

print("Graphs generated successfully! Check 'crypto_performance_analysis.png'")