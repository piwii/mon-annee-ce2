import Foundation
import Vision
import AppKit
let urls = CommandLine.arguments.dropFirst()
var results: [[String: Any]] = []
for path in urls {
 let url = URL(fileURLWithPath: path)
 let request = VNRecognizeTextRequest()
 request.recognitionLevel = .accurate
 request.recognitionLanguages = ["fr-FR"]
 request.usesLanguageCorrection = true
 do {
 try VNImageRequestHandler(url: url).perform([request])
 let lines = (request.results ?? []).compactMap { $0.topCandidates(1).first?.string }
 results.append(["file": url.lastPathComponent, "lines": lines])
 } catch { results.append(["file": url.lastPathComponent, "lines": [], "error": error.localizedDescription]) }
}
let data = try JSONSerialization.data(withJSONObject: results, options: [.prettyPrinted, .sortedKeys])
FileHandle.standardOutput.write(data)
