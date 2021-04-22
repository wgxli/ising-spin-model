# Ising Spin Model
A blazing-fast WebGL implementation of the Ising spin model.

![Screenshot of application](https://github.com/wgxli/ising-spin-model/raw/master/public/screenshot.png)

Reproduces many behaviours of ferromagnetic materials,
including:
- Magnetic domains
- Spontaneous magnetization
- Hysterisis
- Curie temperature

## Technical details
Simulation is done on the GPU (render-to-texture) via Metropolis sampling.
We store 4 spins (one per channel) in each pixel, so the simulation runs at twice
the native pixel resolution of the canvas.

To ensure that pixel updates remain independent
during parallelization, we perform two passes,
each of which updates pixels in a checkerboard formation.
This ensures that two adjacent pixels will never be simultaneously flipped.

Overall magnetization is computed via a kernel-based averaging method.
We keep an ‘averaging buffer’ that is initially set to the texture of spin states,
and repeatedly convolve it with a sparse kernel.
After a few iterations, the image is essentially homogeneous and the average magnetization can be determined by sampling any pixel.
See [my blog post](https://samuelj.li/blog/2020-08-01-kernel-averaging#page-top) for a full explanation.

To avoid impacting performance, in practice we perform one convolution step every few frames or so, so the magnetization is sampled at a rate of a few hertz.
We use all four color channels in each pixel to increase the precision of the computation.
