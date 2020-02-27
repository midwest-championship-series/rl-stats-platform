import carball

def analyzeGame():
  return carball.decompile_replay('temp/example.replay', overwrite=True, output_path='temp/example.json')