import torch
import sys

print("Python version:", sys.version)
print("PyTorch version:", torch.__version__)
print("CUDA available:", torch.cuda.is_available())

# Check for MPS (Metal Performance Shaders) support on Mac
if hasattr(torch, 'mps'):
    print("MPS module exists")
    print("MPS available:", torch.mps.is_available())
    if torch.mps.is_available():
        device = torch.device('mps')
        print("Using MPS device on Mac")
    else:
        device = torch.device('cpu')
        print("MPS not available, using CPU")
else:
    print("MPS module not found in this PyTorch")
    device = torch.device('cpu')
    print("Using CPU device")

print("Selected device:", device)

# Test tensor creation on device
try:
    x = torch.ones(1, device=device)
    print(f"Successfully created tensor on {device}: {x}")
except Exception as e:
    print(f"Error creating tensor on {device}: {e}")
