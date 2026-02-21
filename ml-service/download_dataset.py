import os
import kaggle

# Authenticate (ensure your kaggle.json is in ~/.kaggle/ or %USERPROFILE%/.kaggle/)
# You can also set values directly:
# Set the token from the user provided screenshot
# Set credentials from user input
os.environ['KAGGLE_USERNAME'] = "iamnareshan"
os.environ['KAGGLE_KEY'] = "ff920172ba7c42f61f5b7669f40c4f6c"

dataset = "vipoooool/new-plant-diseases-dataset"
path = "C:/Users/maste/OneDrive/Documents/Skcet/Projects/AgriGuard/ml-service"

print(f"Downloading {dataset} to {path}...")
kaggle.api.dataset_download_files(dataset, path=path, unzip=True)
print("Download complete!")
