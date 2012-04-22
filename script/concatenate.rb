#!/usr/bin/env ruby

require 'pathname'

HOME = Pathname.new(__FILE__).dirname + ".."
include_file = HOME + "javascript" + "include-dev.js"
output_path = HOME + "javascript/homnom-ld23.js"

lines = include_file.read.split("\n").map {|line| line.strip}

def concatenate(min_filepath)
  contents = min_filepath.read.split("\n").map{|line| line.strip}
  contents.shift if (contents[0] == '"use strict";')
  return contents
end

output = []
source_pattern = /[\"\']javascript\/([^\"\']+)[\"\']/
has_started = false
lines.each do |line|
  if (!has_started)
    has_started = true if (line == "head.js(")
  else
    if (line =~ source_pattern) 
      filename = $1
      min_filename = "target/classes/#{filename[0..filename.length - 4]}-min.js"
      min_filepath = HOME + min_filename
      
      output.concat(concatenate(min_filepath))
    end
  end
end



output_path.open("w") do |file|
  file.write(output.join("\n"))
end
