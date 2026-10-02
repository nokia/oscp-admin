<!--
  (c) 2020 Open AR Cloud, This code is licensed under MIT license (see LICENSE.md for details)
  (c) 2024 Nokia, Licensed under the MIT License, SPDX-License-Identifier: MIT
-->

<h2>Spatial Service Discovery</h2>

<p>
    Spatial Service Discovery (SSD) lets an Open Spatial Computing Platform client find nearby spatial services, such as localization, content discovery, and reality modeling services. A client queries with an H3 hexagon without exposing the client's exact location. The SSD searches a wider area and returns coverage polygons that intersect the query hexagon.
</p>

<p>
    Each record is a Spatial Service Record: the provider identity, a coverage polygon, and the service(s) it offers in the coverage area. Writes and provider operations require an OpenID Connect token.
</p>
