package Mojolicious::Plugin::Pedro;

use Mojo::Base 'Mojolicious::Plugin';

our $VERSION = '0.06';

sub register {
    my ( $self, $app ) = @_;

    # Add "templates" and "public" subdirectories to renderer and static
    # paths
    my $base = __FILE__;
    $base =~ s/\.pm//;
    require File::Spec;
    push @{ $app->renderer->paths }, File::Spec->catdir( $base, 'templates' );
    push @{ $app->static->paths },   File::Spec->catdir( $base, 'public' );

    # Prefix /pedro routing
    my $prefix = 'pedro';
    my $route  = $app->routes->route("/$prefix")->to(
        'controller#',
        namespace  => __PACKAGE__,
        plugin     => $self,
        prefix     => $prefix,
        main_title => 'Pedro!',
    );
    $route->get('/')->to('#default');
    $route->post('/line_tokens')->to('controller#line_tokens');
}

1;
__END__

=pod

=head1 NAME

Mojolicious::Plugin::Pedro - A web-based Perl editor Mojolicious plugin

=head1 SYNOPSIS

  # As a Mojolicious plugin
  $self->plugin('Pedro');

  # As a Mojolicious::Lite plugin
  plugin 'Pedro';
  
  # Or as a seperate Pedro webserver
  $ pedro
  

=head1 DESCRIPTION

This is a web-based Perl editor that runs inside your favorite modern
browser. It can embedded in your Mojolicious plugin to edit your files,
or it can be be run as a separate Perl webserver.

There are several operation modes for Pedro:

=over

=item *

As a separate Pedro process, please run the following command and it will 
launch the default browser automatically:

  pedro

=item *

As a L<Mojolicious> plugin, please add the following code to your
script to enable /pedro route:

  $self->plugin('Pedro');

=item *

As L<Mojolicious::Lite> plugin, please add the following code to your
script to enable /pedro route:

  plugin 'Pedro';

To access Pedro, please type L<http://127.0.0.1:3000/pedro> after your
Mojolicious application starts.

=back

=head1 METHODS

L<Mojolicious::Plugin::Pedro> inherits all methods from
L<Mojolicious::Plugin> and implements the following new ones.

=head2 C<register>

  $plugin->register;

Register plugin in L<Mojolicious> application.

=head1 SUPPORT

If you find a bug, please report it in:

L<http://code.google.com/p/mojolicious-plugin-pedro/issues/list>

If you find this module useful, please rate it in:

L<http://cpanratings.perl.org/d/Padre-Plugin-Pedro>

=head1 SEE ALSO

L<Mojolicious>, L<Mojolicious::Guides>, L<http://mojolicio.us>, L<PPI>.

=head1 AUTHOR

Ahmad M. Zawawi <ahmad.zawawi@gmail.com>

=head1 COPYRIGHT AND LICENSE

This software is copyright (c) 2012 by Ahmad M. Zawawi

This is free software; you can redistribute it and/or modify it under
the same terms as the Perl 5 programming language system itself.

=cut
