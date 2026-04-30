---
name: dotnet-development
description: Use when writing or modifying C# / .NET code. Applies general .NET defaults first, and then ASP.NET / Minimal API additions only when the consuming repo docs indicate a web or API app.
---

# .NET Development

This skill captures the current `.NET / C#` house style for this plugin.

Use the general defaults for any `.NET / C#` repository.
Apply the ASP.NET / Minimal API additions only when consuming repo docs indicate a web app or API.

## General .NET defaults

### Project and file layout

- Solution structure: nested project directory inside the repo root, such as `<repo>/<project>/<project>.csproj`.
- `global.json` at the repo root pins the SDK. Prefer `rollForward: "latestMinor"` and `allowPrerelease: false`.
- `csproj` should enable `<Nullable>enable</Nullable>` and `<ImplicitUsings>enable</ImplicitUsings>`.
- Use file-scoped namespaces.
- Namespace mirrors folder hierarchy.
- One primary type per file.
- Filename matches class name exactly.

### Services and DI

- Default to constructor-injected instance classes.
- Use static classes only for pure orchestration with no per-call state.
- Register concrete services directly in DI unless there is a real reason for an interface.
- Use `Singleton` for stateless shared resources and `Scoped` for per-request state.

### HTTP and configuration

- Always use `IHttpClientFactory.CreateClient()`.
- Never `new HttpClient()`.
- Use fail-fast required configuration accessors instead of silent null defaults.

### DTOs and models

- DTOs are `public class` with mutable `{ get; set; }` properties.
- Use `Dto` suffix in PascalCase.
- Non-nullable properties should use `required`.
- Optional properties use nullable types.

### Async, errors, and logging

- All I/O is async.
- Async method names end with `Async`.
- Do not add `ConfigureAwait` in normal ASP.NET Core/server code.
- Services log with context and rethrow.
- Use structured logging with PascalCase placeholders.
- Never use `$"..."` interpolation in `LogXxx(...)` calls.

### Naming and tests

- PascalCase: types, methods, records, constants.
- `_camelCase`: private fields.
- camelCase: locals and parameters.
- Async methods end with `Async`.
- Test stack defaults: xUnit + FluentAssertions.
- Test layout: AAA with blank lines between sections.
- Test naming: `Method_Should_DoX_When_Y`.
- Bug fixes start with a failing regression test.

## ASP.NET / Minimal API additions

Only apply this section when consuming repo docs indicate the repository is an ASP.NET app, Minimal API app, or web/API service.

### Endpoints

- Prefer Minimal API modules over MVC controllers.
- Each endpoint module is a `public static class` with a `Map<Name>Endpoint(this IEndpointRouteBuilder app[, IConfiguration configuration])` extension method.
- Invoke endpoint mapping from `Program.cs`.
- Start with inline lambdas for small handlers; extract `Handle*Async(...)` when the handler grows.
- Return `Results.*` helpers rather than raw status codes.
- Standard chain when applicable: `.WithName(...).WithOpenApi().RequireAuthorization(...)`.

### API error handling

- Catch at the endpoint boundary.
- Log the exception.
- Return `Results.Problem(...)` with a generic external message.
- Do not leak internal exception details to clients.

## Strong defaults, not universal rules

These conventions are intentionally opinionated and based on the current canonical style, but they are not universal truth for every kind of `.NET` application.

If the consuming repo docs clearly indicate a different app shape, follow the repo’s declared direction rather than forcing Minimal API or web-specific patterns into workers, scheduled services, or other non-web applications.

## Anti-patterns to avoid

- `new HttpClient()`
- `$"..."` interpolation in `LogXxx(...)`
- silent catch blocks
- non-nullable DTO properties without `required`
- filename/class-name mismatches
- raw `configuration["X"]` access without fail-fast validation
- interface abstractions for internal services with only one implementation unless there is a real reason
