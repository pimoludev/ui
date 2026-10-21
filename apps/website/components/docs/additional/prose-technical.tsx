"use client";

import { Prose } from "@pimolu/react";

export function DemoExample() {

return (<Prose as="article" size="lg"><h2>A shared visual contract</h2><p>Load <code>@pimolu/web-styles/styles.css</code> once in your application.</p><blockquote>One system. Your identity.</blockquote><h3>Before shipping</h3><ul><li>Verify focus order.</li><li>Check light and dark appearance.</li></ul></Prose>);
}
