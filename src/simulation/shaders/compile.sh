for f in *.glsl
do
    OUTPUT_FILE="../build/${f%.*}.js"
    echo "export default \`" > $OUTPUT_FILE
    cat $f >> $OUTPUT_FILE
    echo "\`;" >> $OUTPUT_FILE
done
