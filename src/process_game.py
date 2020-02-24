import carball

def analyzeGame():
  return carball.decompile_replay('temp/example.replay', overwrite=true, output_path='temp/example.json')