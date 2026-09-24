<!--
  (c) 2020 Open AR Cloud, This code is licensed under MIT license (see LICENSE.md for details)
  (c) 2024 Nokia, Licensed under the MIT License, SPDX-License-Identifier: MIT
-->

<h2>Spatial Content Discovery</h2>

<p>
    Spatial Content Discovery (SCD) lets an Open Spatial Computing Platform client find nearby spatial content, such as 2D and 3D assets and spatial experiences. A client queries with an H3 hexagon, so the search covers an area without exposing the client's exact location.
</p>

<p>
    Each content is described by a Spatial Content Record anchored by a geographic GeoPose, with an optional title, description, and links to the asset. Writes require an OpenID Connect token.
</p>
