import torch

print("PyTorch version:", torch.__version__)
print("CUDA available:", torch.cuda.is_available())

# Check for MPS (Metal Performance Shaders) support on Mac
mps_available = hasattr(torch, 'mps') and torch.mps.is_available()
print("MPS available:", mps_available)

# Determine the best available device
if mps_available:
    device = torch.device('mps')
    print("Using MPS device on Mac")
elif torch.cuda.is_available():
    device = torch.device('cuda')
    print("Using CUDA device")
else:
    device = torch.device('cpu')
    print("Using CPU device")

print("Selected device:", device)
